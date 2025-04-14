
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for our flight services site - UPDATED
				dark: '#1E1E3F', // Updated from #1A1A1A to dark purple
				purple: {
					DEFAULT: '#6A0DAD', // Updated from #A259FF to deeper purple
					50: '#F3EAFF',
					100: '#E6D5FF',
					200: '#D1BAFF',
					300: '#BD9FFF',
					400: '#A259FF',
					500: '#8A3DFF',
					600: '#7222FF',
					700: '#6A0DAD', // Added the new deeper purple
					800: '#4700CC',
					900: '#350099',
				},
				pink: {
					DEFAULT: '#FF00FF', // Added bright pink for subheadings
					light: '#FF66FF',
					dark: '#CC00CC',
				},
				orangered: {
					DEFAULT: '#FF4500', // Added orange-red for specific elements
					light: '#FF7244', 
					dark: '#CC3700',
				},
				gray: {
					light: '#FFFFFF', // Updated from #B3B3B3 to white
					dark: '#2E2E4E'  // Updated from #2A2A2A to dark blue
				},
				panel: 'rgba(46, 46, 78, 0.7)', // Updated from rgba(42, 42, 42, 0.7) to dark blue
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' },
				},
				'flight-board-flip': {
					'0%': { transform: 'rotateX(0deg)' },
					'15%': { transform: 'rotateX(90deg)' },
					'85%': { transform: 'rotateX(90deg)' },
					'100%': { transform: 'rotateX(0deg)' },
				},
				'text-glow': {
					'0%': { textShadow: '0 0 4px rgba(255, 0, 255, 0.3)' }, // Updated to match pink
					'50%': { textShadow: '0 0 12px rgba(255, 0, 255, 0.6)' }, // Updated to match pink
					'100%': { textShadow: '0 0 4px rgba(255, 0, 255, 0.3)' }, // Updated to match pink
				},
				'pulse-glow': {
					'0%': { boxShadow: '0 0 0px rgba(255, 0, 255, 0.5)' }, // Updated to match pink
					'50%': { boxShadow: '0 0 15px rgba(255, 0, 255, 0.8)' }, // Updated to match pink
					'100%': { boxShadow: '0 0 0px rgba(255, 0, 255, 0.5)' }, // Updated to match pink
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'flight-board-flip': 'flight-board-flip 3s ease-in-out',
				'text-glow': 'text-glow 3s infinite ease-in-out',
				'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
			},
			backgroundImage: {
				'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
