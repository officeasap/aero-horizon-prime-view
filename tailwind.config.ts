
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
				// Custom colors for our flight services site
				dark: '#1A1A1A',
				purple: {
					DEFAULT: '#A259FF',
					50: '#F3EAFF',
					100: '#E6D5FF',
					200: '#D1BAFF',
					300: '#BD9FFF',
					400: '#A259FF',
					500: '#8A3DFF',
					600: '#7222FF',
					700: '#5A00FF',
					800: '#4700CC',
					900: '#350099',
				},
				gray: {
					light: '#B3B3B3',
					dark: '#2A2A2A'
				},
				panel: 'rgba(42, 42, 42, 0.7)',
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
					'0%': { textShadow: '0 0 4px rgba(162, 89, 255, 0.3)' },
					'50%': { textShadow: '0 0 12px rgba(162, 89, 255, 0.6)' },
					'100%': { textShadow: '0 0 4px rgba(162, 89, 255, 0.3)' },
				},
				'pulse-glow': {
					'0%': { boxShadow: '0 0 0px rgba(162, 89, 255, 0.5)' },
					'50%': { boxShadow: '0 0 15px rgba(162, 89, 255, 0.8)' },
					'100%': { boxShadow: '0 0 0px rgba(162, 89, 255, 0.5)' },
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
