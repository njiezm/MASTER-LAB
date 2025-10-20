import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                screens: {
                        'xs': '475px',
                        '3xl': '1600px',
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                animation: {
                        'fade-in': 'fadeIn 0.5s ease-in-out',
                        'slide-up': 'slideUp 0.3s ease-out',
                        'slide-down': 'slideDown 0.3s ease-out',
                        'slide-left': 'slideLeft 0.3s ease-out',
                        'slide-right': 'slideRight 0.3s ease-out',
                        'scale-in': 'scaleIn 0.2s ease-out',
                        'bounce-soft': 'bounceSoft 0.6s ease-out',
                        'pulse-soft': 'pulseSoft 2s infinite',
                        'float': 'float 3s ease-in-out infinite',
                },
                keyframes: {
                        fadeIn: {
                                '0%': { opacity: '0' },
                                '100%': { opacity: '1' },
                        },
                        slideUp: {
                                '0%': { transform: 'translateY(10px)', opacity: '0' },
                                '100%': { transform: 'translateY(0)', opacity: '1' },
                        },
                        slideDown: {
                                '0%': { transform: 'translateY(-10px)', opacity: '0' },
                                '100%': { transform: 'translateY(0)', opacity: '1' },
                        },
                        slideLeft: {
                                '0%': { transform: 'translateX(10px)', opacity: '0' },
                                '100%': { transform: 'translateX(0)', opacity: '1' },
                        },
                        slideRight: {
                                '0%': { transform: 'translateX(-10px)', opacity: '0' },
                                '100%': { transform: 'translateX(0)', opacity: '1' },
                        },
                        scaleIn: {
                                '0%': { transform: 'scale(0.95)', opacity: '0' },
                                '100%': { transform: 'scale(1)', opacity: '1' },
                        },
                        bounceSoft: {
                                '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
                                '40%, 43%': { transform: 'translate3d(0, -5px, 0)' },
                                '70%': { transform: 'translate3d(0, -3px, 0)' },
                                '90%': { transform: 'translate3d(0, -1px, 0)' },
                        },
                        pulseSoft: {
                                '0%, 100%': { opacity: '1' },
                                '50%': { opacity: '0.7' },
                        },
                        float: {
                                '0%, 100%': { transform: 'translateY(0px)' },
                                '50%': { transform: 'translateY(-5px)' },
                        },
                },
                spacing: {
                        '18': '4.5rem',
                        '88': '22rem',
                        '128': '32rem',
                },
                maxWidth: {
                        '8xl': '88rem',
                        '9xl': '96rem',
                },
                backdropBlur: {
                        xs: '2px',
                }
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
