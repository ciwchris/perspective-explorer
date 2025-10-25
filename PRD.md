# Planning Guide

A web application that facilitates thoughtful, balanced debates by enabling users to discuss topics with an AI that respectfully presents opposing viewpoints, fostering critical thinking and perspective-taking.

**Experience Qualities**: 
1. **Respectful** - The conversation should feel like a civil discourse between thoughtful individuals, never combative or dismissive
2. **Engaging** - The dialogue should flow naturally, encouraging users to think deeply and respond substantively
3. **Balanced** - Both viewpoints should be acknowledged and explored with equal intellectual rigor

**Complexity Level**: Light Application (multiple features with basic state)
  - The app manages conversation state, topic initialization, and back-and-forth dialogue with minimal complexity but meaningful interaction patterns

## Essential Features

### Topic Initialization
- **Functionality**: User enters a topic and their viewpoint/position on that topic
- **Purpose**: Establishes the foundation for meaningful debate by clearly defining what will be discussed and where the user stands
- **Trigger**: User lands on empty app state or clicks "New Debate"
- **Progression**: Welcome screen → User enters topic in text field → User enters their viewpoint → Click "Start Debate" → AI generates opening statement
- **Success criteria**: Topic and viewpoint are stored, AI generates a relevant opening statement taking the opposite position

### Conversation Exchange
- **Functionality**: Users and AI alternate messages in a threaded conversation format
- **Purpose**: Creates natural dialogue flow where ideas can be explored, challenged, and refined
- **Trigger**: After topic initialization, user or AI sends a message
- **Progression**: User reads AI message → User types response → User sends message → AI processes and responds → Cycle continues
- **Success criteria**: Messages appear in chronological order, AI responses are contextually relevant and maintain opposing viewpoint while being respectful

### Conversation Reset
- **Functionality**: User can start a new debate on a different topic
- **Purpose**: Allows exploration of multiple topics without losing the ability to start fresh
- **Trigger**: User clicks "New Debate" button
- **Progression**: User clicks button → Confirmation dialog appears → User confirms → Conversation clears → Returns to topic initialization
- **Success criteria**: Current conversation is cleared, user can enter new topic and viewpoint

### Message History Persistence
- **Functionality**: Conversation history is saved and persists across sessions
- **Purpose**: Users can close the app and return to continue their debate
- **Trigger**: Automatic on every message exchange
- **Progression**: Message sent → Saved to storage → Available on next visit
- **Success criteria**: Refreshing the page shows the same conversation state

## Edge Case Handling

- **Empty/Invalid Input**: Prevent debate start if topic or viewpoint fields are blank
- **Very Long Messages**: Scroll to latest message automatically, handle text wrapping gracefully
- **AI Generation Failure**: Show friendly error message with retry option
- **Rapid Message Sending**: Disable send button while AI is generating response
- **Offensive Content**: Trust AI to maintain respectful tone regardless of user input

## Design Direction

The design should feel contemplative and intellectual—like a refined study or library space where serious conversations happen. The interface should be minimal and distraction-free, allowing the ideas themselves to take center stage. The aesthetic should communicate thoughtfulness, balance, and respect.

## Color Selection

Triadic color scheme using cool, sophisticated tones that evoke intellectual discourse and balanced debate.

- **Primary Color**: Deep Indigo (oklch(0.35 0.12 270)) - Represents depth of thought and intellectual rigor
- **Secondary Colors**: Slate Gray (oklch(0.45 0.02 250)) for supporting UI elements, communicating neutrality and balance
- **Accent Color**: Warm Amber (oklch(0.70 0.15 70)) for CTAs and important elements, adding a spark of energy to encourage engagement
- **Foreground/Background Pairings**: 
  - Background (Soft Cream oklch(0.97 0.01 90)): Dark Text (oklch(0.25 0.02 270)) - Ratio 13.2:1 ✓
  - Card (Pure White oklch(0.99 0 0)): Dark Text (oklch(0.25 0.02 270)) - Ratio 14.1:1 ✓
  - Primary (Deep Indigo oklch(0.35 0.12 270)): White Text (oklch(0.99 0 0)) - Ratio 8.5:1 ✓
  - Secondary (Slate Gray oklch(0.45 0.02 250)): White Text (oklch(0.99 0 0)) - Ratio 6.1:1 ✓
  - Accent (Warm Amber oklch(0.70 0.15 70)): Dark Text (oklch(0.25 0.02 270)) - Ratio 5.2:1 ✓
  - Muted (Light Gray oklch(0.92 0.01 260)): Medium Text (oklch(0.50 0.02 270)) - Ratio 4.8:1 ✓

## Font Selection

Typography should convey clarity and readability for extended reading, with a modern sans-serif that feels approachable yet professional—Inter or similar geometric sans-serif for its excellent legibility at all sizes.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter SemiBold/32px/tight letter spacing/-0.02em
  - H2 (Topic Title): Inter Medium/24px/normal spacing
  - H3 (Section Headers): Inter Medium/18px/normal spacing
  - Body (Messages): Inter Regular/16px/relaxed line-height 1.6
  - Labels: Inter Medium/14px/normal spacing
  - Captions (Timestamps): Inter Regular/13px/muted color

## Animations

Animations should be subtle and purposeful, reinforcing the flow of conversation without distracting from content—messages should ease into view, transitions should feel like turning pages in a thoughtful discussion.

- **Purposeful Meaning**: Gentle fade-ins for new messages create a sense of natural conversation flow, button interactions provide tactile feedback
- **Hierarchy of Movement**: Focus animation priority on new message arrival (most important), then button/input interactions, minimal decoration elsewhere

## Component Selection

- **Components**: 
  - Card for message bubbles with subtle shadows
  - Textarea for user input with auto-resize
  - Button for send/new debate actions with distinct primary/secondary variants
  - ScrollArea for message container with smooth scrolling
  - Dialog for new debate confirmation
  - Badge to distinguish user vs AI messages
  - Separator to divide initialization from conversation
  
- **Customizations**: 
  - Custom message bubble component that styles differently for user vs AI
  - Gradient background on main container for subtle visual interest
  - Custom scrollbar styling to maintain minimal aesthetic
  
- **States**: 
  - Buttons: Hover shows slight scale/brightness change, disabled state while AI responds
  - Textarea: Focus shows accent border, expands vertically as user types
  - Messages: Subtle slide-in animation on appearance
  
- **Icon Selection**: 
  - Chat/ChatCircle for conversation-related actions
  - ArrowRight/PaperPlaneRight for sending messages
  - Plus/PlusCircle for new debate
  - Lightbulb for topic ideas
  
- **Spacing**: Consistent padding using Tailwind scale - messages use p-4, containers use p-6/p-8, gaps between elements use gap-4/gap-6
  
- **Mobile**: 
  - Stack topic/viewpoint fields vertically on mobile
  - Full-width message bubbles with appropriate padding
  - Fixed bottom input area with send button
  - Scrollable message area takes remaining height
  - Reduce text sizes slightly on mobile (14px body instead of 16px)
