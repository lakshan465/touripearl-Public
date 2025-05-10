/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1A374D",  // Dark Blue
                secondary: "#406882", // Blue
                accent: "#6998AB",   // Teal Blue
                light: "#ADCBD7",    // Light Blue
                highlight: "#9A55F3" // Purple
            },
        },
    },
    plugins: [],
}