import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HelloWorld from '../../src/components/HelloWorld';

describe('HelloWorld Component', () => {
  it('renders greeting message', () => {
    render(<HelloWorld name="Developer" />);
    expect(screen.getByText('Hello, Developer!')).toBeInTheDocument();
  });

  it('uses default name when no name provided', () => {
    render(<HelloWorld />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});
