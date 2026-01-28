/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#1DB954", // Neon Green
                background: "#121212", // Matte Black
                card: "#1E1E1E",
                text: "#FFFFFF",
                textSecondary: "#A0A0A0",
            },
        },
    },
    plugins: [],
}
