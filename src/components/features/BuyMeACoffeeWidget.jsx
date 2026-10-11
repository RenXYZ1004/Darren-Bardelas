import { useEffect } from 'react';
import { BUY_ME_A_COFFEE_ID } from '../../lib/support';

export function BuyMeACoffeeWidget() {
  useEffect(() => {
    if (document.getElementById('bmc-support-widget')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'bmc-support-widget';
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.async = true;
    script.dataset.name = 'BMC-Widget';
    script.dataset.id = BUY_ME_A_COFFEE_ID;
    script.dataset.description = 'Support my work on Buy Me a Coffee';
    script.dataset.message = '';
    script.dataset.color = '#00d2ff';
    script.dataset.position = 'Right';
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');

    document.head.appendChild(script);
  }, []);

  return null;
}
