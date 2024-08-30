import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import './Lottery.css';

const Lottery = () => {
    const [numTickets, setNumTickets] = useState('');
    const [numWinners, setNumWinners] = useState('');
    const [winners, setWinners] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleDraw = () => {
        if (numTickets === '' || numWinners === '') {
            setErrorMessage('Vennligst fyll ut begge feltene før du trekker vinnere.');
            return;
        }

        setErrorMessage(''); // Fjern feilmeldingen hvis valideringen er bestått

        const ticketsArray = Array.from({ length: parseInt(numTickets) }, (_, i) => i + 1);
        const drawnWinners = [];

        for (let i = 0; i < numWinners; i++) {
            const randomIndex = Math.floor(Math.random() * ticketsArray.length);
            drawnWinners.push(ticketsArray.splice(randomIndex, 1)[0]);
        }

        setWinners(drawnWinners);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Loddtrekningsvinnere:', 10, 10);
        winners.forEach((winner, index) => {
            doc.text(`Vinner ${index + 1}: Lodd nr. ${winner}`, 10, 20 + index * 10);
        });
        doc.save('lottery_winners.pdf');
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(winners.map((winner, index) => ({
            'Vinner': index + 1,
            'Loddnummer': winner
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Vinnere');
        XLSX.writeFile(wb, 'lottery_winners.xlsx');
    };

    const handleReset = () => {
        const confirmReset = window.confirm("Er du sikker på at du vil rense alle dataene?");
        if (confirmReset) {
            setNumTickets('');
            setNumWinners('');
            setWinners([]);
            setErrorMessage(''); // Fjern eventuelle feilmeldinger
        }
    };

    return (
        <div className="lottery-container">
            <h1>Loddtrekning</h1>
            <div className="input-group">
                <label>Antall loddbøker solgt:</label>
                <input
                    type="number"
                    value={numTickets}
                    onChange={(e) => setNumTickets(e.target.value)}
                    placeholder="Skriv inn antall loddbøker KADINGS"
                />
            </div>
            <div className="input-group">
                <label>Antall vinnere:</label>
                <input
                    type="number"
                    value={numWinners}
                    onChange={(e) => setNumWinners(e.target.value)}
                    placeholder="Skriv inn antall vinnere"
                />
            </div>
            <button className="draw-button" onClick={handleDraw}>Trekk vinnere</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <TransitionGroup className="winner-list">
                {winners.map((winner, index) => (
                    <CSSTransition key={index} timeout={500} classNames="fade">
                        <div className="winner-item">Vinner {index + 1}: Lodd nr. {winner}</div>
                    </CSSTransition>
                ))}
            </TransitionGroup>
            {winners.length > 0 && (
                <div className="export-buttons">
                    <button className="export-button" onClick={exportToPDF}>Eksporter til PDF</button>
                    <button className="export-button" onClick={exportToExcel}>Eksporter til Excel</button>
                </div>
            )}
            {winners.length > 0 && (
                <button className="reset-button" onClick={handleReset}>Rens alt</button>
            )}
        </div>
    );
};

export default Lottery;
