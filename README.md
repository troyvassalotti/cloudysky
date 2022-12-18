# `<cloudy-sky>`

Beautify your content by transporting it into nature.

## Installation

Via npm: `npm install @troyv/cloudysky`

## Usage

Use the default slot to wrap any content in a scenic view. Apply the boolean `[hillside]` attribute to be placed in a field. Clouds will appear based on an intersection observer so animations aren't running when they don't need to. A button in the top right of the component will turn off/on the clouds.

Styling can be enhanced with CSS parts and custom properties.

1. `::part(hillside)`: The SVG hill.
2. `--cloud-foreground`: The CSS background image for the forefound clouds.
3. `--cloud-background`: The CSS background image for the background clouds.
4. `--cloud-filter`: The CSS filter for the clouds.
