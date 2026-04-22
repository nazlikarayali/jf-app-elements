import { useState } from 'react';
import { Button } from '../Button/Button';
import './EmergencyContacts.scss';

export interface EmergencyContactsProps {
  selected?: boolean;
}

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

const CONTACTS: Contact[] = [
  { id: '1', name: 'Sarah Johnson', relationship: 'Mother', phone: '(555) 234-5678', isPrimary: true },
  { id: '2', name: 'David Johnson', relationship: 'Father', phone: '(555) 234-5679', isPrimary: false },
  { id: '3', name: 'Dr. Emily Park', relationship: 'Pediatrician', phone: '(555) 800-1234', isPrimary: false },
];

export function EmergencyContacts({ selected = false }: EmergencyContactsProps) {
  const [contacts] = useState(CONTACTS);

  const classes = ['jf-emergency', selected && 'jf-emergency--selected'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-emergency__header">
        <div className="jf-emergency__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <div className="jf-emergency__header-text">
          <h3 className="jf-emergency__title">Emergency Contacts</h3>
          <p className="jf-emergency__subtitle">For Emma Johnson</p>
        </div>
      </div>

      {/* Contact list */}
      <div className="jf-emergency__list">
        {contacts.map(contact => (
          <div key={contact.id} className="jf-emergency__contact">
            <div className="jf-emergency__contact-left">
              <div className="jf-emergency__avatar">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="jf-emergency__contact-info">
              <div className="jf-emergency__contact-top">
                <span className="jf-emergency__contact-name">{contact.name}</span>
                {contact.isPrimary && (
                  <span className="jf-emergency__primary-badge">Primary</span>
                )}
              </div>
              <span className="jf-emergency__contact-relationship">{contact.relationship}</span>
              <span className="jf-emergency__contact-phone">{contact.phone}</span>
            </div>
            <div className="jf-emergency__contact-actions">
              <Button variant="Default" size="Small" label="Call" leftIcon="none" rightIcon="none" shrinked />
              <Button variant="Outlined" size="Small" label="Edit" leftIcon="none" rightIcon="none" shrinked />
            </div>
          </div>
        ))}
      </div>

      {/* Add contact */}
      <Button variant="Outlined" size="Default" label="Add Emergency Contact" leftIcon="Plus" rightIcon="none" shrinked />
    </div>
  );
}

export default EmergencyContacts;
