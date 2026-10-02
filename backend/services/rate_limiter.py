import time
import threading
from functools import wraps
from typing import Dict, List, Tuple
from flask import request, jsonify
from config import Config


class InMemoryRateLimiter:
    """
    Thread-safe, sliding-window rate limiter for Flask endpoints.
    Allows rate limits like '30 per minute', '5 per second', or '100 per hour'.
    """

    def __init__(self):
        self._lock = threading.Lock()
        # Mapping: key -> list of timestamps
        self._records: Dict[str, List[float]] = {}

    def _parse_limit_string(self, limit_str: str) -> Tuple[int, int]:
        """
        Parses limit strings like '30 per minute' or '10/m' into (max_requests, window_seconds).
        """
        try:
            parts = limit_str.strip().lower().replace("/", " per ").split()
            count = int(parts[0])
            unit = parts[-1]

            if "sec" in unit:
                window = 1
            elif "min" in unit:
                window = 60
            elif "hour" in unit:
                window = 3600
            elif "day" in unit:
                window = 86400
            else:
                window = 60
            return count, window
        except Exception:
            return 60, 60

    def get_client_ip(self) -> str:
        """
        Extracts client IP address safely, checking X-Forwarded-For if behind a proxy.
        """
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Use the first client IP in the chain
            return forwarded_for.split(",")[0].strip()
        return request.remote_addr or "127.0.0.1"

    def is_rate_limited(self, category: str, limit_str: str) -> Tuple[bool, int]:
        """
        Checks if the request exceeds the rate limit.
        Returns (is_limited, retry_after_seconds).
        """
        if not Config.RATE_LIMIT_ENABLED:
            return False, 0

        max_requests, window_seconds = self._parse_limit_string(limit_str)
        client_ip = self.get_client_ip()
        bucket_key = f"{category}:{client_ip}"
        now = time.time()
        window_start = now - window_seconds

        with self._lock:
            # Clean up old timestamps
            timestamps = self._records.get(bucket_key, [])
            valid_timestamps = [ts for ts in timestamps if ts > window_start]

            if len(valid_timestamps) >= max_requests:
                # Rate limit exceeded; calculate retry-after
                oldest = valid_timestamps[0]
                retry_after = max(1, int(oldest + window_seconds - now))
                self._records[bucket_key] = valid_timestamps
                return True, retry_after

            valid_timestamps.append(now)
            self._records[bucket_key] = valid_timestamps
            return False, 0


# Global instance
limiter = InMemoryRateLimiter()


def rate_limit(category: str):
    """
    Decorator for Flask routes to apply configurable rate limiting.
    Categories: 'ask', 'stream', 'upload', 'index', 'default'.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            limit_str = getattr(
                Config,
                f"RATE_LIMIT_{category.upper()}",
                Config.RATE_LIMIT_DEFAULT,
            )

            is_limited, retry_after = limiter.is_rate_limited(category, limit_str)
            if is_limited:
                response = jsonify({
                    "success": False,
                    "error": "Too Many Requests",
                    "message": f"Rate limit exceeded for {category}. Please wait {retry_after} seconds before retrying.",
                    "retry_after_seconds": retry_after,
                })
                response.status_code = 429
                response.headers["Retry-After"] = str(retry_after)
                return response

            return fn(*args, **kwargs)
        return wrapper
    return decorator
