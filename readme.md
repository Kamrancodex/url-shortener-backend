# URL Shortener Backend

This is the backend service for a URL shortener application. It provides APIs to shorten URLs and redirect to the original URLs.

## Features

- Shorten long URLs
- Redirect to original URLs using short links
- Track usage statistics

## Technologies Used

- Node.js
- Express.js
- MongoDB

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/kamrancodex/url-shortener-backend.git
   ```
2. Navigate to the project directory:
   ```sh
   cd url-shortener-backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```
MONGO_URI=your_mongodb_connection_string
PORT=your_port_number
BASE_URL=your_base_url
```

## Running the Application

Start the server:

```sh
npm start
```

The backend service will be running on the port specified in the `.env` file.

## API Endpoints

### Shorten URL

- **URL:** `/api/shorten`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "longUrl": "https://example.com"
  }
  ```
- **Response:**
  ```json
  {
    "shortUrl": "http://your_base_url/abc123"
  }
  ```

### Redirect to Original URL

- **URL:** `/:code`
- **Method:** `GET`
- **Response:** Redirects to the original URL

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
