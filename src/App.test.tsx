import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('FuturePowerAIPlus app', () => {
  it('renders the app shell', () => {
    render(<App />);
    expect(screen.getByText(/FuturePowerAIPlus/i)).toBeInTheDocument();
  });

  it('answers a simple math prompt', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/ask anything/i);
    fireEvent.change(input, { target: { value: '2 + 3' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText(/Result: 5/i)).toBeInTheDocument();
  });

  it('solves an equation', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/ask anything/i);
    fireEvent.change(input, { target: { value: '2x + 7 = 19' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText(/x = 6/i)).toBeInTheDocument();
  });
});
