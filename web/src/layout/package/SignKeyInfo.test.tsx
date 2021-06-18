import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { RepositoryKind } from '../../types';
import SignKeyInfo from './SignKeyInfo';

const defaultProps = {
  signed: true,
  signKey: {
    fingerprint: '0011223344',
    url: 'https://key.url',
  },
  repoKind: RepositoryKind.Helm,
};

describe('SignKeyInfo', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates snapshot', () => {
    const result = render(<SignKeyInfo {...defaultProps} />);
    expect(result.asFragment()).toMatchSnapshot();
  });

  describe('Render', () => {
    it('renders component', () => {
      render(<SignKeyInfo {...defaultProps} />);
      expect(screen.getByText('View key info')).toBeInTheDocument();
    });

    it('opens modal', () => {
      render(<SignKeyInfo {...defaultProps} />);

      const btn = screen.getByText('View key info');
      userEvent.click(btn);

      expect(screen.getByText('Sign key information'));
      expect(screen.getByText('Fingerprint')).toBeInTheDocument();
      expect(screen.getByText('0011223344')).toBeInTheDocument();
      expect(screen.getByText('URL')).toBeInTheDocument();
      expect(screen.getByText('https://key.url')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
      expect(screen.getAllByTestId('ctcBtn')).toHaveLength(2);
    });
  });

  describe('renders disabled button', () => {
    it('when signed is true and signKey is undefined', async () => {
      render(<SignKeyInfo signed repoKind={RepositoryKind.Helm} />);

      const btn = screen.getByTestId('signKeyBtn');
      expect(btn).toHaveClass('disabled');
      userEvent.hover(btn);

      expect(await screen.findByRole('tooltip')).toBeInTheDocument();

      expect(screen.getByText("The publisher hasn't provided any information for this key yet")).toBeInTheDocument();
    });
  });

  describe('does not render button', () => {
    it('when signed is null', () => {
      const { container } = render(<SignKeyInfo signed={null} repoKind={RepositoryKind.Helm} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('when signed is false', () => {
      const { container } = render(<SignKeyInfo signed={false} repoKind={RepositoryKind.Helm} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('when repoKind is not Helm', () => {
      const { container } = render(<SignKeyInfo {...defaultProps} repoKind={RepositoryKind.OLM} />);
      expect(container).toBeEmptyDOMElement();
    });
  });
});
