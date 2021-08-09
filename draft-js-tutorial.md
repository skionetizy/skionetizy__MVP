# Draft JS

Draft js is a framework for making text editors. We can make features like including "@Mentions", "Rich Text Editor".

We are using it for showing underline under wrong spellings.

**LINKS**

- [Offical docs](https://draftjs.org/docs/getting-started)
- [Rich text editing with Draft.js](https://youtu.be/rHat0n1xBVc)
- [Draft JS Examples](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0)

**Why we using draft js, not `<textarea>`**

Native HTML textarea Element does not allow any css customization. In our case, we want to show a underline below wrong spells.

**And `<textarea spellcheck={true}>`**

We using flask backend and machine learning for detecting wrong spells but the HTML5's spellcheck attribute uses device's built-in spell dictionary.

**Draft JS Concepts**

- Block: every new-line is a block with a unique key (e.g. `<div data-key="fsdk-j32">`). A Block hold text, and entities.

- Entity: Entity is used to add functionality to text in a range. It has 4 main properties: Type, Mutability, Offset, Length

  - Type: we use this property to check which text part (sub-string) has to wrapped in a Component

  - Mutability: can be "MUTABLE", "IMMUTABLE", "SEGMENTED". It controls the behaviour of _backspace_ key

    (e.g. if the entity is immutable then on backspace instead of remove a character whole entity (according to its range) will be removed)

  - Offset: is the starting index of its parent block text

  - Length: Offset + Length = End Index upto which entity should wrap text in a our Component.

- CompositeDecorator:
  it is class in whick we define that which entity is decorated with specified Component

  ![Composite Decorator](/draftjs-tutorial-images/composite_decorator.png)

  Composite Decorator takes an array of objects. These objects have a strategy function and component property. The strategy function is executed for recently changed block ('s text). If the strategy function returns `true` then the block will be wrapped in `component` we specified

  But we want to decorate individual word. So we looping over every entity in block and calling the `callback` argument passed by draftjs (calling `callback` is same as returning true)

- **Selection API**

  Selection API takes care of thing like cursor position, user selection's start index (anchorOffset) & end index (focusOffset), if user is selecting backward or not.

- **Modifier**

  Modifier is used to apply a type (entity type) to selected text

  ![User selecting a piece of text](/draftjs-tutorial-images/selection_api.png)

  In above pic user is selecting some text, after selecting we use Modifier to apply entity. Selection api will give offset and length, we pass Type and Mutability as argument in Modifier. These four are the thing need for an entity.
