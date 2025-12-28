# ImageTools

A modern, client-side web application for resizing and cropping images. Built with React, Vite, and Tailwind CSS.

## Features

- **Drag & Drop Interface**: Easily upload images by dragging them onto the page.
- **Client-Side Processing**: All image manipulations (cropping, resizing) happen directly in your browser. No images are uploaded to a server.
- **Advanced Cropping**: Intuitive cropping tool with zoom and rotation support.
- **Smart Resizing**: Resize images with aspect ratio locking.
- **Format Support**: Import and export in PNG and JPEG formats.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Processing**: 
  - [react-easy-crop](https://github.com/ricardo-ch/react-easy-crop)
  - [react-dropzone](https://react-dropzone.js.org/)
  - Native HTML5 Canvas API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd image-tools-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Docker Support

You can also build and run the application using Docker via npm scripts:
 
 1. Build the image:
    ```bash
    npm run docker:build
    ```
 
 2. Run the container:
    ```bash
    npm run docker:run
    ```
 
    The app will be available at `http://localhost:8080`.

## License

MIT
