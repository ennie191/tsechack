import React from 'react'
import { Box, Typography, Button, Container, Paper } from '@mui/material'
import { Error, Refresh } from '@mui/icons-material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error('Error Boundary Caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center',
              background: theme => `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
              border: theme => `1px solid ${theme.palette.divider}`,
              borderRadius: 4
            }}
          >
            <Error sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
            
            <Typography variant="h5" gutterBottom fontWeight="600">
              Cosmic System Error
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              We've encountered an unexpected issue while monitoring space weather conditions.
            </Typography>

            <Box sx={{ 
              p: 2, 
              bgcolor: 'background.default', 
              borderRadius: 2, 
              mb: 3,
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              maxHeight: 120,
              overflow: 'auto'
            }}>
              {this.state.error && this.state.error.toString()}
            </Box>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleRetry}
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #60a5fa 30%, #a78bfa 90%)',
                borderRadius: 3,
                px: 4,
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Retry Application
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
              If the problem persists, contact our support team.
            </Typography>
          </Paper>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary