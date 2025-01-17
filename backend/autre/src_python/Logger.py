import logging

# Define ANSI color codes for the log levels
COLORS = {
    "DEBUG": "\033[36m",    # Cyan
    "INFO": "\033[32m",     # Green
    "WARNING": "\033[33m",  # Yellow
    "ERROR": "\033[31m",    # Red
    "CRITICAL": "\033[41m", # Red background
    "RESET": "\033[0m"      # Reset to default
}

class ColoredFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        color = COLORS.get(record.levelname, "")
        reset = COLORS["RESET"]
        levelname = f"{color}{record.levelname}{reset}"
        return f"{levelname}:\t  {record.getMessage()}"

# Singleton logger setup
logger = logging.getLogger("GlobalLogger")
if not logger.hasHandlers():  # Prevent duplicate handlers
    handler = logging.StreamHandler()
    handler.setFormatter(ColoredFormatter())
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)  # Default log level
