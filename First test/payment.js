// Add event listener to card number input
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let number = e.target.value.replace(/\s+/g, '');
    
    // Format card number with spaces
    if (number.length > 0) {
        number = number.match(new RegExp('.{1,4}', 'g')).join(' ');
        e.target.value = number;
    }

    // Detect card type
    const rawNumber = number.replace(/\s+/g, '');
    let cardType = '';

    // Card type detection
    if (/^4/.test(rawNumber)) {
        cardType = 'Visa';
    } else if (/^5[1-5]/.test(rawNumber)) {
        cardType = 'Mastercard';
    } else if (/^3[47]/.test(rawNumber)) {
        cardType = 'American Express';
    } else if (/^6(?:011|5)/.test(rawNumber)) {
        cardType = 'Discover';
    }

    // Update card type display
    const cardTypeDisplay = document.getElementById('card-type');
    cardTypeDisplay.textContent = cardType;
}); 