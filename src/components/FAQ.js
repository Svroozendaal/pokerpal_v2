import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Container,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqItems = [
    {
      question: "What is PokerPal and how does it help with poker games?",
      answer: "PokerPal is a free online poker payout calculator specifically designed for cash games. It helps you calculate winnings, track player results, and manage poker game payouts easily. Whether you're playing in a home game or at a casino, PokerPal makes it simple to settle up after the game."
    },
    {
      question: "How do I calculate poker payouts using PokerPal?",
      answer: "Using PokerPal is simple: 1) Enter the number of players in your game, 2) Input each player's starting stack (buy-in amount), 3) Enter their ending stack, and 4) Click 'Calculate' to see how much each player owes or is owed. The calculator automatically handles all the math, making it easy to settle up after the game."
    },
    {
      question: "Can I track my poker game history with PokerPal?",
      answer: "Yes! PokerPal allows you to save your game results and track your poker history. This feature helps you monitor your performance over time, analyze your results, and keep a record of all your poker sessions. You can access your history anytime to review past games."
    },
    {
      question: "Does PokerPal support different currencies?",
      answer: "Yes, PokerPal supports multiple currencies, making it perfect for players worldwide. You can easily switch between different currencies to calculate payouts in your preferred currency."
    },
    {
      question: "Is PokerPal suitable for both home games and casino poker?",
      answer: "Absolutely! PokerPal is designed to work for both home games and casino poker. It's perfect for casual home games where you need to settle up after playing, as well as for tracking your results in casino cash games."
    },
    {
      question: "Do I need to create an account to use PokerPal?",
      answer: "No, PokerPal is completely free to use without requiring an account. However, creating an account allows you to save your game history and access your results across different devices."
    },
    {
      question: "How accurate is the PokerPal calculator?",
      answer: "PokerPal provides 100% accurate calculations for poker payouts. It handles all the complex math involved in settling poker games, ensuring that every player gets exactly what they're owed. The calculator takes into account all buy-ins and final stacks to determine the correct payouts."
    },
    {
      question: "Can I use PokerPal on my mobile device?",
      answer: "Yes, PokerPal is fully responsive and works on all devices including smartphones and tablets. You can easily calculate payouts and track your games on the go."
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ mt: 2 }}>
          {faqItems.map((item, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                mb: 1,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography sx={{ fontWeight: 500 }}>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default FAQ; 