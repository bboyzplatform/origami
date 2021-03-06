# Forms

[TL;DR;](#tldr)

Angular's template (`NgModel`) and reactive (`FormControl`) forms are a core part of many applications.

For example, a `<paper-checkbox>` implements the IronCheckedElementBehavior, IronFormElementBehavior, and IronValidatableBehavior. It is built to work inside an `<iron-form>`.

By default, `<paper-checkbox>` has a `checked` attribute that we can bind to.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <form #ngForm="ngForm">
      <paper-checkbox [checked]="isChecked" (changed-changed)="isChecked = $event.detail.value" 
          required></paper-checkbox>
      <button type="submit" [disabled]="!ngForm.form.valid">Submit</button>
    </form>
  `
})
export class PolyComponent {
  isChecked: boolean;
}
```

Our property is bound correctly, but `NgForm`'s validity is incorrect when the checkbox is unchecked. This is because `<paper-checkbox>` does not have an `NgControl` (specifically an `NgModel` for this template-driven form).

## IronControl

Origami provides the `[ironControl]` directive. `[ironControl]` will connect an element to an Angular `NgControl`, provided the element implements one of the following Polymer behaviors:

- IronFormElementBehavior
- IronCheckedElementBehavior
- IronSelectableBehavior

A warning will be generated in the console if `[ironControl]` can't support the custom element.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <form #ngForm="ngForm">
      <paper-checkbox ironControl [(ngModel)]="isChecked" required></paper-checkbox>
      <button type="submit" [disabled]="!ngForm.form.valid">Submit</button>
    </form>
  `
})
export class PolyComponent {
  isChecked: boolean;
}
```

Now the submit button is disabled until the `<paper-checkbox>` is checked!

`[ironControl]` also works with reactive forms.

```ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-poly',
  template: `
    <form [formGroup]="form">
      <paper-checkbox ironControl formControlName="checkbox"></paper-checkbox>
      <button type="submit" [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class PolyComponent {
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      checkbox: [false, Validators.required]
    });
  }
}
```

### IronSelectableBehavior

Sometimes (looking at you `<paper-dropdown-menu>`) an element will implement IronFormElementBehavior, but wraps a separate iron selectable component. `[ironControl]` listens for selection changes on the parent element, when it needs to listen to them on a child element.

In these cases, add `[ironControl]` to the parent element and specify an `[ironSelector]` element reference to the child selectable.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <form #ngForm="ngForm">
      <!-- paper-dropdown-menu is the control -->
      <paper-dropdown-menu ironControl [(ngModel)]="selectedItem" [ironSelector]="listbox" required>
        <!-- but paper-listbox is the IronSelectable -->
        <paper-listbox #listbox attr-for-selected="value">
          <paper-item value="item-1">Item 1</paper-item>
          <paper-item value="item-2">Item 2</paper-item>
          <paper-item value="item-3">Item 3</paper-item>
        </paper-listbox>
      </paper-dropdown-menu>

      <button type="submit" [disabled]="!ngForm.form.valid">Submit</button>
    </form>
  `
})
export class PolyComponent {
  selectedItem: string;
}
```

## Validation

`[ironControl]` will run any validation implemented by a custom element may with IronValidatableBehavior.

Additionally, Angular validation will also affect the element's `invalid` property.

This means that Polymer validation will update Angular control validity, and custom Angular validation will update Polymer's validity!

In our template-driven form example, `<paper-checkbox>` has a `validate()` function that will return false if the checkbox is required and unchecked.

Angular also provides a validator for the `required` attribute. In reality, the form is running two separate validation checks.

If the form is invalid, `<paper-checkbox>`'s `NgModel.errors` is equal to

```js
{
  "required": true, // Angular validation
  "polymer": true // IronValidatableBehavior validation
}
```

IronValidatableBehavior emits a single result (true or false) for validation. It does not specify the exact error like Angular does. If `polymer` is set to true, that means the custom element's validation failed.

> The clever programmers will notice that in our reactive form, only the single Angular validation is run, since the `required` attribute is not used.

<a name="tldr"></a>
## Recap (TL;DR;)

To enable template and reactive form jolly cooperation between Angular and Polymer:

1. Add the `[ironControl]` attribute
2. ???
3. Profit

Don't forget that

- Angular validation will update Polymer validity
- Polymer validation will update Angular validity
