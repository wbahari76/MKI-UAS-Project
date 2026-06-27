import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
    	extend: {
    		fontFamily: {
    			sans: [
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			]
    		},
    		colors: {
    			forest: {
    				DEFAULT: '#131511',
    				card: '#1B1E16',
    				beige: '#EAE1D1',
    				muted: '#A3A89D',
    				accent: '#5C6B45',
    				border: '#2A2F22',
    			},
    			primary: {
    				DEFAULT: '#10B981',
    				hover: '#059669',
    				light: '#34D399',
    				dark: '#047857',
    				foreground: '#FFFFFF'
    			},
    			secondary: {
    				DEFAULT: '#2563EB',
    				hover: '#1D4ED8',
    				light: '#60A5FA',
    				dark: '#1E40AF',
    				foreground: '#FFFFFF'
    			},
    			accent: {
    				DEFAULT: '#F59E0B',
    				hover: '#D97706',
    				light: '#FBBF24',
    				dark: '#B45309'
    			},
    			success: '#22C55E',
    			warning: '#F59E0B',
    			danger: '#EF4444',
    			info: '#3B82F6',
    			background: '#FFFFFF',
    			'background-secondary': '#F8FAFC',
    			'background-hover': '#F1F5F9',
    			'text-primary': '#0F172A',
    			'text-secondary': '#475569',
    			'text-muted': '#94A3B8',
    			card: {
    				DEFAULT: '#FFFFFF',
    				hover: '#F1F5F9',
    				foreground: '#0F172A'
    			},
    			popover: {
    				DEFAULT: '#FFFFFF',
    				foreground: '#0F172A'
    			},
    			foreground: '#0F172A',
    			border: '#E2E8F0',
    			input: '#E2E8F0',
    			ring: '#10B981',
    			muted: {
    				DEFAULT: '#F8FAFC',
    				foreground: '#64748B'
    			},
    			destructive: {
    				DEFAULT: '#EF4444',
    				foreground: '#FFFFFF'
    			},
    			chart: {
    				'1': '#10B981',
    				'2': '#2563EB',
    				'3': '#F59E0B',
    				'4': '#EF4444',
    				'5': '#8B5CF6'
    			}
    		},
    		fontSize: {
    			h1: [
    				'48px',
    				{
    					lineHeight: '1.2',
    					fontWeight: '700'
    				}
    			],
    			h2: [
    				'36px',
    				{
    					lineHeight: '1.2',
    					fontWeight: '700'
    				}
    			],
    			h3: [
    				'28px',
    				{
    					lineHeight: '1.3',
    					fontWeight: '600'
    				}
    			],
    			h4: [
    				'24px',
    				{
    					lineHeight: '1.4',
    					fontWeight: '500'
    				}
    			],
    			body: [
    				'16px',
    				{
    					lineHeight: '1.5'
    				}
    			],
    			caption: [
    				'14px',
    				{
    					lineHeight: '1.5'
    				}
    			],
    			small: [
    				'12px',
    				{
    					lineHeight: '1.5',
    					fontWeight: '500'
    				}
    			]
    		},
    		borderRadius: {
    			sm: '8px',
    			md: '12px',
    			lg: '16px',
    			xl: '20px',
    			'2xl': '24px',
    			'3xl': '32px',
    			btn: '12px',
    			card: '16px',
    			modal: '24px'
    		},
    		boxShadow: {
    			card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    			'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    			modal: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    			primary: '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
    			secondary: '0 4px 14px 0 rgba(37, 99, 235, 0.25)'
    		},
    		spacing: {
    			'18': '4.5rem',
    			'22': '5.5rem',
    			'26': '6.5rem',
    			'30': '7.5rem'
    		},
    		maxWidth: {
    			container: '1280px'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'fade-in': {
    				from: {
    					opacity: '0'
    				},
    				to: {
    					opacity: '1'
    				}
    			},
    			'fade-up': {
    				from: {
    					opacity: '0',
    					transform: 'translateY(20px)'
    				},
    				to: {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			'fade-down': {
    				from: {
    					opacity: '0',
    					transform: 'translateY(-20px)'
    				},
    				to: {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			'slide-in-right': {
    				from: {
    					transform: 'translateX(100%)'
    				},
    				to: {
    					transform: 'translateX(0)'
    				}
    			},
    			'slide-in-left': {
    				from: {
    					transform: 'translateX(-100%)'
    				},
    				to: {
    					transform: 'translateX(0)'
    				}
    			},
    			'scale-in': {
    				from: {
    					opacity: '0',
    					transform: 'scale(0.95)'
    				},
    				to: {
    					opacity: '1',
    					transform: 'scale(1)'
    				}
    			},
    			'count-up': {
    				from: {
    					transform: 'translateY(100%)'
    				},
    				to: {
    					transform: 'translateY(0)'
    				}
    			},
    			'pulse-ring': {
    				'0%': {
    					transform: 'scale(1)',
    					opacity: '1'
    				},
    				'100%': {
    					transform: 'scale(1.5)',
    					opacity: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-in': 'fade-in 0.3s ease-out',
    			'fade-up': 'fade-up 0.4s ease-out',
    			'fade-down': 'fade-down 0.4s ease-out',
    			'slide-in-right': 'slide-in-right 0.3s ease-out',
    			'slide-in-left': 'slide-in-left 0.3s ease-out',
    			'scale-in': 'scale-in 0.2s ease-out',
    			'count-up': 'count-up 0.5s ease-out',
    			'pulse-ring': 'pulse-ring 1.5s ease-out infinite'
    		},
    		transitionTimingFunction: {
    			'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    		}
    	}
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;
