🎣 Hook Me Now

A high-fidelity, "One-Button" survival game built with React Native and Expo. Players must time their strikes to catch fish while avoiding apex predators in a minimalist, glassmorphic environment.

Technical Stack

Framework: React Native (Expo)
Animations: Lottie (JSON-based vector animations)
State Management: Custom Hooks (`useScore`, `useGameLogic`)
Storage: AsyncStorage for local persistence (Coins, High Scores, Inventory)
Icons: Expo Vector Icons (Ionicons, MaterialIcons)

Features

One-Button Gameplay: Simplified mechanics focusing on timing and precision.
System Market: A specialized shop where players can acquire premium visual modules using earned credits.
Dynamic Environments: Multiple stages with varying difficulty and aesthetic color palettes.
Immersive Themes: Support for full-screen "Deep Abyss" background overrides featuring 60fps marine life animations.
Educational Content: Integrated trivia system featuring real-world shark facts.

Installation & Setup

1.Clone the repository:
git clone https://github.com/yourusername/hook-me-now.git
cd hook-me-now

2.Install dependencies:
npm install

3.Run the project:
npx expo start

Game Mechanics

Catching: Each successful catch increases your score by 100 points.
Economy: Scores are converted to coins at a rate of Score / 2 upon game completion.
The Deep Abyss: A premium theme that overrides standard environmental protocols with high-fidelity marine life and dynamic underwater lighting.


The core concept for Hook Me Now was to strip away the complexity of modern mobile gaming and return to the "One-Button" philosophy. I create a high-fidelity survival game where the player’s only input is a perfectly timed strike. Set in a minimalist, glassmorphic underwater world, the goal is to balance the reward of catching fish with the risk of being intercepted by apex predators.

Beyond just the gameplay, I wanted to build an immersive ecosystem. This included a "System Market" where players can spend earned coins on premium visual modules and the "Deep Abyss" theme. The idea was to make the environment feel alive using 60fps Lottie animations, turning a simple React Native app into a vibrant, high-performance marine simulation that even includes educational shark trivia.

What was the most difficult part to implement?
The most challenging aspect was achieving 60fps performance within a React Native environment while handling multiple overlaying animations. In the "Deep Abyss" mode, managing high-fidelity marine life animations alongside the real-time game logic required very careful optimization.

Because I used Lottie for vector animations, I had to ensure that the JSON files weren't clogging the bridge between the native side and the JavaScript side. Coordinating the "Strike" mechanic—which requires millisecond precision—with the state updates in my custom useGameLogic hook was a hurdle. I had to move away from standard state updates for the most intensive parts of the game loop to avoid the "stutter" that can sometimes plague React Native games, ensuring that when a player taps, the "hook" registers instantly.

What would you improve with more time?
If I had more time, I would focus on three major upgrades:

Haptic Feedback Integration: To truly sell the "one-button" feel, I would implement tiered haptic patterns (using expo-haptics) so players could feel the difference between a small catch and a predator strike without looking at the screen.

Global Leaderboards: While AsyncStorage works perfectly for local high scores, I would transition to a Firebase or Supabase backend to allow players to compete globally for the title of "Top Angler."

Procedural Difficulty: Currently, the stages have set difficulty palettes. I would love to implement a procedural algorithm that scales the speed and predator frequency dynamically based on the player's current session performance, making the survival aspect feel more organic.



