# I Can't Write Jam Entry, "Drowning Among Stars"

A short narrative and puzzle driven text adventure about disaster in the final frontier.  Repair your spacecraft and get to safety before you run out of breathable air!

This game was created for the [I Can't Write (But Want to Tell a Story)](https://itch.io/jam/i-cant-write-but-want-to-tell-a-story) jam, and built with TypeScript and React.

Tested in Firefox and Chrome; it's playable in Edge but I don't recommend it (practically all the visual effects are broken, and the way it renders the background makes text very hard to read); I don't have a machine capable of testing it with Safari so your mileage may vary.

### Features:

 - Classic command-driven text adventure
 - Space!
 - In-game map, inventory, and help UI
 - Potential sabotage?
 - Built in hint system
 - Did I mention it's in space?

### Known Issues:

 - The "last seen location" for items sometimes does not update correctly.
 - When long sections of text are printed, the beginning of the text can be pushed out the top of the screen (although you should still be able to read it by scrolling up).

* This isn't even a joke! Okay no it is a joke, but it's not a lie.  The background image was modeled in Blender and then rendered in the raytracing engine Cycles.  The resulting image is used as a static background, but it was raytraced and is the largest of three graphics in the game so it counts.

What?  Don't look at me like that - I'm not a wizard, and RTX definitely isn't supported in Javascript yet so this is as good as you're getting for now.
