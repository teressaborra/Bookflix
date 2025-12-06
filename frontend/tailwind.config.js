/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#E50914', // Netflix/Gaming Red
                secondary: '#1F2937',
                dark: '#0B0C15', // Deep dark blue/black from reference
                card: '#151725', // Slightly lighter for cards
                text: '#E5E7EB',
                muted: '#9CA3AF',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Oswald', 'sans-serif'], // Gaming/Bold look
            },
        },
    },
    plugins: [],
}
