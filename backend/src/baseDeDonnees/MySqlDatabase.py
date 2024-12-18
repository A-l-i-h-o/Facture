import mysql.connector
from mysql.connector import Error

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
                print("Successfully connected to MySQL server")
        except Error as e:
            print(f"Error while connecting to MySQL: {e}")
            self.connection = None

    def execute_query(self, query, params=None):
        """
        Execute a SQL query (e.g., INSERT, UPDATE, DELETE).

        :param query: The SQL query to execute.
        :param params: (Optional) Parameters for the query.
        :return: The number of affected rows.
        """
        if self.connection is None or not self.connection.is_connected():
            print("No connection to the database.")
            return None

        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            self.connection.commit()
            affected_rows = cursor.rowcount
            cursor.close()
            return affected_rows
        except Error as e:
            print(f"Error executing query: {e}")
            return None

    def fetch_query(self, query, params=None):
        """
        Execute a SELECT query and fetch results.

        :param query: The SQL query to execute.
        :param params: (Optional) Parameters for the query.
        :return: The query results as a list of tuples.
        """
        if self.connection is None or not self.connection.is_connected():
            print("No connection to the database.")
            return None

        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            results = cursor.fetchall()
            cursor.close()
            return results
        except Error as e:
            print(f"Error fetching query: {e}")
            return None

    def close_connection(self):
        """Close the connection to the MySQL server."""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL connection closed.")

# Example usage:
if __name__ == "__main__":
    # default xamp server configuration
    db = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
    db.connect()

    # Example query execution
    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    )
    """
    db.execute_query(create_table_query)

    # Insert example
    insert_query = "INSERT INTO users (name, email) VALUES (%s, %s)"
    db.execute_query(insert_query, ("John Doe", "john@example.com"))

    # Fetch example
    select_query = "SELECT * FROM users"
    results = db.fetch_query(select_query)
    for row in results:
        print(row)

    db.close_connection()
