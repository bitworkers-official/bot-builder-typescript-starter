---
to: src/dialogs/index.ts
inject: true
append: true
---
export { <%= h.inflection.titleize(name) %> } from './<%= h.inflection.titleize(name) %>/<%= h.inflection.titleize(name) %>'
