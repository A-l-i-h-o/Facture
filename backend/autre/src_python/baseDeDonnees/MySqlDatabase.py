import mysql.connector
from mysql.connector import Error

from Logger import logger

class MySQLDatabase:
    def __init__(self, host, user, password, database=None):
        """
        Initialize the MySQLDatabase class.

        :param host: The hostname or IP address of the MySQL server.
        :param user: The MySQL username.
        :param password: The MySQL password.
        :param database: (Optional) The name of the database to use.
        """
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None

    def connect(self):
        """Establish a connection to the MySQL server."""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            if self.connection.is_connected():
                logger.info("Successfully connected to MySQL server")
        except Error as e:
            logger.debug(f"Error while connecting to MySQL: {e}")
            self.connection = None
            
    def callproc(self, procedure,arguments):
        
        cursor = self.connection.cursor()
        return cursor.callproc(procedure, arguments)

        
    def execute_query(self, query, params=None):
        """
        Execute a SQL query (e.g., INSERT, UPDATE, DELETE).

        :param query: The SQL query to execute.
        :param params: (Optional) Parameters for the query.
        :return: The number of affected rows.
        """
        if self.connection is None or not self.connection.is_connected():
            logger.debug("No connection to the database.")
            return None

        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            self.connection.commit()
            affected_rows = cursor.rowcount
            cursor.close()
            return affected_rows
        except Error as e:
            logger.debug(f"Error executing query: {e}")
            return None

    def fetch_query(self, query, params=None):
        """
        Execute a SELECT query and fetch results.

        :param query: The SQL query to execute.
        :param params: (Optional) Parameters for the query.
        :return: The query results as a list of tuples.
        """
        if self.connection is None or not self.connection.is_connected():
            logger.debug("No connection to the database.")
            return None

        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            results = cursor.fetchall()
            cursor.close()
            return results
        except Error as e:
            logger.debug(f"Error fetching query: {e}")
            return None

    def close_connection(self):
        """Close the connection to the MySQL server."""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            logger.info("MySQL connection closed.")

