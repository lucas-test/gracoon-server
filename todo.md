# TODO

## Features

- [ ] when the user goes out of the window, set pos to undefined and broadcast

## Refacto

- [ ] camelCase
- [ ] elementsKind should be an enum used in Modifications
- [ ] deleteElements: do not need maps for vertices and links as they contain their index
- [ ] SubdivideLink: optimize emitImpl and emitDeimpl
.
- [ ] ajouter automatiquement les Modifications en lisant le dossier

## Issues

- [ ] sensibilities of Modification

## Done

- [X] add elements: when creating a vertex or a link or ... data should include colors and cp and weights ...
- [X] add coord | undefined for the position of a user
- [X] merge: control points disapear after meerge
- [X] only use boards, not graph
- [X] upgrade gramoloss to 1.6.0
- [X] board should has a roomId
- [X] Client class and static method addEvent for modification