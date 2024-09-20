export const topics = [
    {
      name: 'HTML',
      subtopics: [
        {
          name: 'Forms',
          x: '-5vw', y: '-10vw',
          quiz: [
            { question: 'What is the <form> tag used for?', options: ['To create a form', 'To format text', 'To link pages'], answer: 'To create a form' },
            { question: 'Which input type is used for submitting data?', options: ['submit', 'button', 'text'], answer: 'submit' },
            { question: 'Which tag is used to group related elements in a form?', options: ['<fieldset>', '<div>', '<span>'], answer: '<fieldset>' }
          ]
        },
        {
          name: 'Tables',
          x: '-20vw', y: '2vw',
          quiz: [
            { question: 'Which tag is used to create a table?', options: ['<table>', '<div>', '<ul>'], answer: '<table>' },
            { question: 'Which tag is used for a table row?', options: ['<tr>', '<td>', '<th>'], answer: '<tr>' },
            { question: 'Which tag is used for a table header?', options: ['<th>', '<tr>', '<td>'], answer: '<th>' }
          ]
        },
        {
          name: 'Tags',
          x: '20vw', y: '6vw',
          quiz: [
            { question: 'What does an HTML tag start with?', options: ['<', '[', '{'], answer: '<' },
            { question: 'What does an HTML tag end with?', options: ['>', '}', ']'], answer: '>' },
            { question: 'Which tag is used to create a paragraph?', options: ['<p>', '<h1>', '<div>'], answer: '<p>' }
          ]
        },
        {
          name: 'Attributes',
          x: '0vw', y: '12vw',
          quiz: [
            { question: 'Which attribute is used to define a unique identifier for an element?', options: ['id', 'class', 'name'], answer: 'id' },
            { question: 'What does the href attribute specify?', options: ['Hyperlink', 'Font size', 'Background color'], answer: 'Hyperlink' },
            { question: 'Which attribute specifies an alternative text for an image?', options: ['alt', 'src', 'title'], answer: 'alt' }
          ]
        },
        {
          name: 'Semantic Elements',
          x: '-20vw', y: '-15vw',
          quiz: [
            { question: 'What is a semantic HTML element?', options: ['An element with meaning', 'An element without attributes', 'An element for styling'], answer: 'An element with meaning' },
            { question: 'Which element is used for an article?', options: ['<article>', '<div>', '<section>'], answer: '<article>' },
            { question: 'Which tag represents a header?', options: ['<header>', '<footer>', '<nav>'], answer: '<header>' }
          ]
        },
        {
          name: 'Images',
          x: '15vw', y: '-12vw',
          quiz: [
            { question: 'Which tag is used to embed an image?', options: ['<img>', '<figure>', '<picture>'], answer: '<img>' },
            { question: 'Which attribute is used to specify the source of an image?', options: ['src', 'alt', 'href'], answer: 'src' },
            { question: 'What is the purpose of the alt attribute?', options: ['Alternative text', 'Image height', 'Image URL'], answer: 'Alternative text' }
          ]
        },
        {
          name: 'Links',
          x: '32vw', y: '-5vw',
          quiz: [
            { question: 'Which tag is used to create a hyperlink?', options: ['<a>', '<link>', '<href>'], answer: '<a>' },
            { question: 'Which attribute specifies the URL of the linked page?', options: ['href', 'src', 'target'], answer: 'href' },
            { question: 'Which value of the target attribute opens the link in a new tab?', options: ['_blank', '_self', '_parent'], answer: '_blank' }
          ]
        },
        {
          name: 'Audio/Video',
          x: '-32vw', y: '-5vw',
          quiz: [
            { question: 'Which tag is used to embed audio?', options: ['<audio>', '<sound>', '<voice>'], answer: '<audio>' },
            { question: 'Which attribute specifies the source of an audio file?', options: ['src', 'href', 'url'], answer: 'src' },
            { question: 'Which tag is used to embed video?', options: ['<video>', '<iframe>', '<object>'], answer: '<video>' }
          ]
        },
        {
          name: 'Meta Tags',
          x: '0vw', y: '-20vw',
          quiz: [
            { question: 'Which tag is used to specify metadata?', options: ['<meta>', '<head>', '<title>'], answer: '<meta>' },
            { question: 'Which attribute specifies the character encoding for the document?', options: ['charset', 'lang', 'meta'], answer: 'charset' },
            { question: 'Which meta tag is used for responsive design?', options: ['viewport', 'content', 'name'], answer: 'viewport' }
          ]
        },
        {
          name: 'Iframes',
          x: '-25vw', y: '18vw',
          quiz: [
            { question: 'Which tag is used to embed another HTML page?', options: ['<iframe>', '<embed>', '<object>'], answer: '<iframe>' },
            { question: 'Which attribute is used to specify the URL of the page to embed?', options: ['src', 'href', 'url'], answer: 'src' },
            { question: 'What is the purpose of the allowfullscreen attribute?', options: ['Allow full-screen mode', 'Allow scrolling', 'Allow linking'], answer: 'Allow full-screen mode' }
          ]
        },
        {
          name: 'Block/Inline',
          x: '18vw', y: '18vw',
          quiz: [
            { question: 'What type of element is <div>?', options: ['Block-level', 'Inline', 'Inline-block'], answer: 'Block-level' },
            { question: 'What type of element is <span>?', options: ['Inline', 'Block-level', 'None'], answer: 'Inline' },
            { question: 'Which element is block-level by default?', options: ['<section>', '<a>', '<strong>'], answer: '<section>' }
          ]
        }
      ]
    },
    {
      name: 'CSS',
      subtopics: [
        {
          name: 'Selectors',
          x: '-5vw', y: '-10vw',
          quiz: [
            { question: 'Which symbol is used for ID selectors?', options: ['#', '.', '*'], answer: '#' },
            { question: 'Which symbol is used for class selectors?', options: ['.', '#', '*'], answer: '.' },
            { question: 'Which selector selects all elements?', options: ['*', '#', '.'], answer: '*' }
          ]
        },
        {
          name: 'Box Model',
          x: '-20vw', y: '2vw',
          quiz: [
            { question: 'Which property defines the space inside an element?', options: ['padding', 'margin', 'border'], answer: 'padding' },
            { question: 'Which property defines the outermost space around an element?', options: ['margin', 'padding', 'border'], answer: 'margin' },
            { question: 'Which property defines the thickness of the border?', options: ['border-width', 'padding', 'margin'], answer: 'border-width' }
          ]
        },
        {
          name: 'Flexbox',
          x: '20vw', y: '6vw',
          quiz: [
            { question: 'Which property makes an element a flex container?', options: ['display: flex', 'flex-direction', 'justify-content'], answer: 'display: flex' },
            { question: 'Which property defines the direction of flex items?', options: ['flex-direction', 'align-items', 'justify-content'], answer: 'flex-direction' },
            { question: 'Which property aligns items along the main axis?', options: ['justify-content', 'align-items', 'align-content'], answer: 'justify-content' }
          ]
        },
        {
          name: 'Grid',
          x: '0vw', y: '12vw',
          quiz: [
            { question: 'Which property creates a grid container?', options: ['display: grid', 'grid-template', 'grid-area'], answer: 'display: grid' },
            { question: 'Which property defines the columns of the grid?', options: ['grid-template-columns', 'grid-template-rows', 'grid-gap'], answer: 'grid-template-columns' },
            { question: 'Which property defines the space between grid items?', options: ['grid-gap', 'margin', 'padding'], answer: 'grid-gap' }
          ]
        },
        {
          name: 'Colors',
          x: '-20vw', y: '-15vw',
          quiz: [
            { question: 'Which property defines the text color of an element?', options: ['color', 'background-color', 'border-color'], answer: 'color' },
            { question: 'Which property sets the background color of an element?', options: ['background-color', 'color', 'border-color'], answer: 'background-color' },
            { question: 'Which CSS function defines an RGBA color?', options: ['rgba()', 'rgb()', 'hsl()'], answer: 'rgba()' }
          ]
        },
        {
          name: 'Typography',
          x: '15vw', y: '-12vw',
          quiz: [
            { question: 'Which property sets the font size?', options: ['font-size', 'font-weight', 'font-family'], answer: 'font-size' },
            { question: 'Which property sets the font family?', options: ['font-family', 'font-size', 'font-style'], answer: 'font-family' },
            { question: 'Which property sets the boldness of text?', options: ['font-weight', 'font-size', 'text-align'], answer: 'font-weight' }
          ]
        },
        {
          name: 'Positioning',
          x: '32vw', y: '-5vw',
          quiz: [
            { question: 'Which property sets the position of an element?', options: ['position', 'top', 'left'], answer: 'position' },
            { question: 'Which value of the position property makes the element positioned relative to its nearest ancestor?', options: ['absolute', 'relative', 'fixed'], answer: 'relative' },
            { question: 'Which value of the position property fixes the element to the viewport?', options: ['fixed', 'absolute', 'relative'], answer: 'fixed' }
          ]
        },
        {
          name: 'Animations',
          x: '-32vw', y: '-5vw',
          quiz: [
            { question: 'Which property specifies the name of the animation?', options: ['animation-name', 'animation-duration', 'animation-timing-function'], answer: 'animation-name' },
            { question: 'Which property specifies the duration of an animation?', options: ['animation-duration', 'animation-name', 'animation-timing-function'], answer: 'animation-duration' },
            { question: 'Which property defines how an animation progresses over time?', options: ['animation-timing-function', 'animation-duration', 'animation-name'], answer: 'animation-timing-function' }
          ]
        },
        {
          name: 'Transforms',
          x: '0vw', y: '-20vw',
          quiz: [
            { question: 'Which property applies 2D or 3D transformation to an element?', options: ['transform', 'translate', 'rotate'], answer: 'transform' },
            { question: 'Which function is used to move an element horizontally or vertically?', options: ['translate()', 'scale()', 'rotate()'], answer: 'translate()' },
            { question: 'Which function is used to scale an element?', options: ['scale()', 'rotate()', 'translate()'], answer: 'scale()' }
          ]
        },
        {
          name: 'Transitions',
          x: '-25vw', y: '18vw',
          quiz: [
            { question: 'Which property allows for transition effects?', options: ['transition', 'animation', 'transform'], answer: 'transition' },
            { question: 'Which property defines the duration of a transition?', options: ['transition-duration', 'transition-timing-function', 'transition-property'], answer: 'transition-duration' },
            { question: 'Which property defines the CSS property to apply the transition to?', options: ['transition-property', 'transition-duration', 'transition-delay'], answer: 'transition-property' }
          ]
        },
        {
          name: 'Media Queries',
          x: '18vw', y: '18vw',
          quiz: [
            { question: 'Which rule is used to create media queries?', options: ['@media', '@query', '@screen'], answer: '@media' },
            { question: 'Which media feature is used to apply styles based on screen width?', options: ['max-width', 'min-height', 'orientation'], answer: 'max-width' },
            { question: 'Which value of orientation is used for landscape mode?', options: ['landscape', 'portrait', 'wide'], answer: 'landscape' }
          ]
        }
      ]
    },
    {
      name: 'JavaScript',
      subtopics: [
        {
          name: 'Variables',
          x: '-5vw', y: '-10vw',
          quiz: [
            { question: 'Which keyword is used to declare a variable in ES6?', options: ['let', 'var', 'const'], answer: 'let' },
            { question: 'Which keyword is used to declare a constant?', options: ['const', 'let', 'var'], answer: 'const' },
            { question: 'Which operator is used for assignment?', options: ['=', '==', '==='], answer: '=' }
          ]
        },
        {
          name: 'Functions',
          x: '-20vw', y: '2vw',
          quiz: [
            { question: 'Which keyword is used to define a function?', options: ['function', 'var', 'let'], answer: 'function' },
            { question: 'Which keyword is used to return a value from a function?', options: ['return', 'exit', 'yield'], answer: 'return' },
            { question: 'Which type of function can be defined without a name?', options: ['Anonymous function', 'Named function', 'IIFE'], answer: 'Anonymous function' }
          ]
        },
        {
          name: 'Objects',
          x: '20vw', y: '6vw',
          quiz: [
            { question: 'Which syntax is used to define an object?', options: ['{ }', '[ ]', '( )'], answer: '{ }' },
            { question: 'How do you access a property of an object?', options: ['dot notation', 'bracket notation', 'both'], answer: 'both' },
            { question: 'Which method is used to iterate over an object\'s properties?', options: ['for...in', 'for...of', 'forEach'], answer: 'for...in' }
          ]
        },
        {
          name: 'Arrays',
          x: '0vw', y: '12vw',
          quiz: [
            { question: 'Which syntax is used to define an array?', options: ['[ ]', '{ }', '( )'], answer: '[ ]' },
            { question: 'Which method is used to add an item to the end of an array?', options: ['push()', 'pop()', 'shift()'], answer: 'push()' },
            { question: 'Which method removes the last element from an array?', options: ['pop()', 'shift()', 'splice()'], answer: 'pop()' }
          ]
        },
        {
          name: 'ES6+',
          x: '-20vw', y: '-15vw',
          quiz: [
            { question: 'Which keyword is used to declare a block-scoped variable in ES6?', options: ['let', 'var', 'const'], answer: 'let' },
            { question: 'Which syntax is used for template literals?', options: ['` `', '""', '\'\''], answer: '` `' },
            { question: 'Which feature of ES6+ allows default values in function parameters?', options: ['Default parameters', 'Rest parameters', 'Spread operator'], answer: 'Default parameters' }
          ]
        },
        {
          name: 'DOM Manipulation',
          x: '15vw', y: '-12vw',
          quiz: [
            { question: 'Which method is used to select an element by its ID?', options: ['getElementById', 'querySelector', 'getElementsByClassName'], answer: 'getElementById' },
            { question: 'Which method adds an event listener to an element?', options: ['addEventListener', 'attachEvent', 'onClick'], answer: 'addEventListener' },
            { question: 'Which property is used to change the content of an HTML element?', options: ['innerHTML', 'value', 'textContent'], answer: 'innerHTML' }
          ]
        },
        {
          name: 'Events',
          x: '32vw', y: '-5vw',
          quiz: [
            { question: 'Which event is triggered when a user clicks an element?', options: ['click', 'mouseover', 'keypress'], answer: 'click' },
            { question: 'Which event is triggered when a key is pressed?', options: ['keydown', 'keypress', 'keyup'], answer: 'keydown' },
            { question: 'Which event is triggered when a form is submitted?', options: ['submit', 'change', 'input'], answer: 'submit' }
          ]
        },
        {
          name: 'Promises',
          x: '-32vw', y: '-5vw',
          quiz: [
            { question: 'Which method is used to handle a fulfilled promise?', options: ['then()', 'catch()', 'finally()'], answer: 'then()' },
            { question: 'Which method is used to handle a rejected promise?', options: ['catch()', 'then()', 'finally()'], answer: 'catch()' },
            { question: 'Which method is called when a promise is either fulfilled or rejected?', options: ['finally()', 'catch()', 'then()'], answer: 'finally()' }
          ]
        },
        {
          name: 'Async/Await',
          x: '0vw', y: '-20vw',
          quiz: [
            { question: 'Which keyword is used to define an asynchronous function?', options: ['async', 'await', 'defer'], answer: 'async' },
            { question: 'Which keyword pauses the execution of an async function until the promise is resolved?', options: ['await', 'async', 'resolve'], answer: 'await' },
            { question: 'Which type of function returns a promise?', options: ['Async function', 'Generator function', 'Anonymous function'], answer: 'Async function' }
          ]
        },
        {
          name: 'Closures',
          x: '-25vw', y: '18vw',
          quiz: [
            { question: 'What is a closure?', options: ['A function with access to its own scope, the outer scope, and the global scope', 'A self-invoking function', 'A function that returns another function'], answer: 'A function with access to its own scope, the outer scope, and the global scope' },
            { question: 'Why are closures used?', options: ['To preserve state in an asynchronous environment', 'To invoke a function immediately', 'To simplify function syntax'], answer: 'To preserve state in an asynchronous environment' },
            { question: 'Which keyword creates a closure?', options: ['function', 'let', 'const'], answer: 'function' }
          ]
        },
        {
          name: 'Hoisting',
          x: '18vw', y: '18vw',
          quiz: [
            { question: 'What is hoisting?', options: ['The default behavior of moving declarations to the top', 'The automatic execution of a function', 'The creation of a new variable scope'], answer: 'The default behavior of moving declarations to the top' },
            { question: 'Which types of variables are hoisted?', options: ['var', 'let', 'const'], answer: 'var' },
            { question: 'Are function declarations hoisted?', options: ['Yes', 'No', 'Only in ES6'], answer: 'Yes' }
          ]
        }
      ]
    }
  ]
  