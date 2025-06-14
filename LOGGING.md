# Agent Logging System

This document explains the comprehensive logging system implemented for debugging VAPI agent interactions.

## Overview

The logging system tracks all aspects of agent interactions including:

- Input voice (user transcripts)
- Output voice (assistant responses)
- Processing steps and workflow states
- API calls and responses
- Errors and exceptions

## Log Structure

Each log entry contains:

```typescript
{
  timestamp: string;        // ISO timestamp
  sessionId: string;        // Unique session identifier
  userId?: string;          // User ID if available
  type: "input" | "output" | "processing" | "error" | "api_call";
  data: {
    content?: string;       // Message content
    role?: string;          // user/assistant/system
    error?: string;         // Error message
    processingStep?: string; // Processing step name
    // ... other contextual data
  }
}
```

## Log Types

### Input Logs

- Captures user voice input transcripts
- Logged when `message.role === "user"` and `transcriptType === "final"`

### Output Logs

- Captures assistant voice responses
- Logged when `message.role === "assistant"` and `transcriptType === "final"`

### Processing Logs

- Call status changes (connecting, active, finished)
- Speech start/end events
- Workflow initialization
- Feedback generation steps
- Database operations

### Error Logs

- VAPI errors
- API call failures
- Processing exceptions
- Workflow failures

### API Call Logs

- Request/response data for `/api/vapi/generate`
- Feedback creation API calls
- Success/failure status

## File Storage

Logs are stored in `/logs/agent-logs-YYYY-MM-DD.json` format:

- One file per day
- JSON array of log entries
- Automatically created as needed

## Debugging Interface

Access the debug panel at `/debug/logs`:

- View logs by date
- Filter by session ID
- Real-time statistics
- Error highlighting
- Export functionality

## Usage Examples

### Debugging "Oops, Something went wrong"

1. Note the approximate time when the error occurred
2. Go to `/debug/logs`
3. Select the current date
4. Look for error logs (red highlighted)
5. Check the session ID from the error
6. Filter by that session ID to see the full conversation flow
7. Look for processing steps that failed

### Common Debugging Patterns

**Agent not responding:**

- Check for `call_started` and `speech_started` events
- Look for VAPI connection errors
- Verify workflow initialization logs

**Workflow failures:**

- Look for `api_call` logs to `/api/vapi/generate`
- Check for database save errors
- Verify question generation success

**Feedback generation issues:**

- Search for `feedback_generation_start` logs
- Check AI analysis success/failure
- Look for database save errors

## Session Flow

A typical successful session includes:

1. `agent_component_initialized`
2. `call_initiation_started`
3. `starting_generate_workflow` or `starting_interview_workflow`
4. `call_started`
5. Multiple `input`/`output` message pairs
6. `call_ended`
7. `feedback_generation_started` (for interviews)
8. `feedback_generation_success`

## Error Recovery

When you see "Oops, Something went wrong":

1. Check the logs for the exact error
2. Common issues:
   - API rate limits
   - Network connectivity
   - Invalid workflow configuration
   - Database connection issues
   - AI model failures

## Log Maintenance

- Logs are kept indefinitely by default
- Consider implementing log rotation for production
- Debug endpoint allows deletion of logs older than 7 days
- Monitor disk space usage in `/logs` directory

## Environment Variables

Ensure these are set for proper logging:

- `NEXT_PUBLIC_VAPI_WEB_TOKEN` - For VAPI connection
- `NEXT_PUBLIC_VAPI_WORKFLOW_ID` - For workflow execution

## Privacy Considerations

- Logs contain user voice transcripts
- Consider data retention policies
- Implement log anonymization if needed
- Secure access to debug endpoints in production
