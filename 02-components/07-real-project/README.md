# 05 Real project

In this example we will implement tests in a real project.

We will start from `00-boilerplate`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- We will testing `./src/common/components/search-bar`. It has a `component` and `hook` file:

### ./src/common/components/search-bar/search-bar.component.spec.tsx

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import { SearchBarComponent } from "./search-bar.component";

describe("common/search-bar/search-bar.component specs", () => {
  it("should render an input with placeholder and searchIcon when it feeds required props", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

- Let's render the component and check the input element:

### ./src/common/components/search-bar/search-bar.component.spec.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SearchBarComponent } from './search-bar.component';

describe('common/search-bar/search-bar.component specs', () => {
  it('should render an input with placeholder and searchIcon when it feeds required props', () => {
    // Arrange
+   const props = {
+     search: 'test search',
+     onSearch: jest.fn(),
+     labels: {
+       placeholder: 'test placeholder',
+     },
+   };

    // Act
+   render(<SearchBarComponent {...props} />);

+   const inputElement = screen.getByRole('textbox') as HTMLInputElement;

    // Assert
+   expect(inputElement).toBeInTheDocument();
+   expect(inputElement.value).toEqual('test search');
  });
});

```
> [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
>
> [Which query should I use?](https://testing-library.com/docs/guide-which-query)

- Another option is using:

```javascript
const inputElement = screen.getByPlaceholderText('test placeholder') as HTMLInputElement;
```

- Start test watch:

```bash
npm run test:watch search-bar
```

- If we want to search icon element, we have to update the code:

### ./src/common/components/search-bar/search-bar.component.tsx

```diff
...
  return (
    <TextField
      className={className}
      value={search}
      onChange={e => onSearch(e.target.value)}
      placeholder={labels.placeholder}
      InputProps={{
-       startAdornment: <SearchIcon />,
+       startAdornment: <SearchIcon aria-label="Search icon" />,
      }}
    />
  );
};

```

### ./src/common/components/search-bar/search-bar.component.spec.tsx

```diff
...
    // Arrange
    const props = {
      search: 'test search',
      onSearch: jest.fn(),
      labels: {
        placeholder: 'test placeholder',
      },
    };

    // Act
    render(<SearchBarComponent {...props} />);

    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
+   const iconElement = screen.getByLabelText('Search icon');

    // Assert
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toEqual('test search');
+   expect(iconElement).toBeInTheDocument();
  });
});

```

- Add second spec testing `onSearch` method:

### ./src/common/components/search-bar/search-bar.component.spec.tsx

```diff
import React from 'react';
- import { render, screen } from '@testing-library/react';
+ import { render, screen, fireEvent } from '@testing-library/react';
...

+ it('should call onSearch prop when it types on input change event', () => {
+   // Arrange
+   const props = {
+     search: 'test search',
+     onSearch: jest.fn(),
+     labels: {
+       placeholder: 'test placeholder',
+     },
+   };

+   // Act
+   render(<SearchBarComponent {...props} />);

+   const inputElement = screen.getByRole('textbox');
+   fireEvent.change(inputElement, { target: { value: 'new text search' } });

+   // Assert
+   expect(props.onSearch).toHaveBeenCalledWith('new text search');
+ });
...

```

- Let's add specs to `./src/common/components/form/select`:

### ./src/common/components/form/select/select.component.spec.tsx

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SelectComponent } from './select.component';

describe('common/components/form/select/select.component specs', () => {
  it('should render a select element when it feeds required props and three items', () => {
    // Arrange
    
    // Act
    
    // Assert
  });
});
```

- Run test watch:

```bash
npm run test:watch select
```

- Let's implement the first spec:

### ./src/common/components/form/select/select.component.spec.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SelectComponent } from './select.component';
+ import { Lookup } from 'common/models';

describe('common/components/form/select/select.component specs', () => {
  it('should render a select element when it feeds required props and three items', () => {
    // Arrange
+   const props = {
+     items: [
+       { id: '1', name: 'Item 1' },
+       { id: '2', name: 'Item 2' },
+       { id: '3', name: 'Item 3' },
+     ] as Lookup[],
+     label: 'Test label',
+     value: '',
+   };
    
    // Act
+   render(<SelectComponent {...props} />);
    
+   const selectElement = screen.getByRole('button', { name: 'Test label' });
    // Assert
+   expect(selectElement).toBeInTheDocument();
  });
});
```

- Testing it should shows 3 items when it clicks on select:

### ./src/common/components/form/select/select.component.spec.tsx

```diff
import React from 'react';
- import { render, screen } from '@testing-library/react';
+ import { render, screen, fireEvent } from '@testing-library/react';
...

+ it('should render a menu with three item when it clicks on select element', () => {
+   // Arrange
+   const props = {
+     items: [
+       { id: '1', name: 'Item 1' },
+       { id: '2', name: 'Item 2' },
+       { id: '3', name: 'Item 3' },
+     ] as Lookup[],
+     label: 'Test label',
+     value: '',
+   };

+   // Act
+   render(<SelectComponent {...props} />);

+   const selectElement = screen.getByRole('button', { name: 'Test label' });
+   fireEvent.click(selectElement);
+   const menuElement = screen.getByRole('listbox');

+   // Assert
+   expect(menuElement).toBeInTheDocument();
+ });
```

> It fails.
> We research about it and found this [issue](https://github.com/testing-library/react-testing-library/issues/322)

- Install library:

```bash
npm install @testing-library/user-event --save-dev
```

- Update spec:

### ./src/common/components/form/select/select.component.spec.tsx

```diff
import React from 'react';
- import { render, screen, fireEvent } from '@testing-library/react';
+ import { render, screen } from '@testing-library/react';
+ import userEvent from '@testing-library/user-event';
...

  it('should render a menu with three item when it clicks on select element', () => {
    // Arrange
    const props = {
      items: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
      ] as Lookup[],
      label: 'Test label',
      value: '',
    };

    // Act
    render(<SelectComponent {...props} />);

    const selectElement = screen.getByRole('button', { name: 'Test label' });
-   fireEvent.click(selectElement);
+   expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    
+   userEvent.click(selectElement);
    const menuElement = screen.getByRole('listbox');
+   const itemElementList = screen.getAllByRole('option');

    // Assert
    expect(menuElement).toBeInTheDocument();
+   expect(itemElementList).toHaveLength(3);
  });
```

- Testing should calls onChange method when it clicks on second item:

### ./src/common/components/form/select/select.component.spec.tsx

```diff
...

+ it('should calls onChange method with value equals 2 when it clicks on second item', () => {
+   // Arrange
+   const props = {
+     items: [
+       { id: '1', name: 'Item 1' },
+       { id: '2', name: 'Item 2' },
+       { id: '3', name: 'Item 3' },
+     ] as Lookup[],
+     label: 'Test label',
+     value: '',
+     onChange: jest.fn(),
+   };

+   // Act
+   render(<SelectComponent {...props} />);

+   const selectElement = screen.getByRole('button', { name: 'Test label' });

+   userEvent.click(selectElement);
+   const itemElementList = screen.getAllByRole('option');
+   userEvent.click(itemElementList[1]);

+   // Assert
+   expect(props.onChange).toHaveBeenCalledWith(
+     expect.objectContaining({ target: { value: '2' } }),
+     expect.anything()
+   );
+ });
```

- Testing should update selected item when it clicks on third item using Formik:

### ./src/common/components/form/select/select.component.spec.tsx

```diff
...
+ it('should update selected item when it clicks on third item using Formik', () => {
+   // Arrange
+   const props = {
+     items: [
+       { id: '1', name: 'Item 1' },
+       { id: '2', name: 'Item 2' },
+       { id: '3', name: 'Item 3' },
+     ] as Lookup[],
+     label: 'Test label',
+     name: 'selectedItem',
+   };

+   // Act
+   render(<SelectComponent {...props} />);
+ });
```

- Create `renderWithFormik`:

### ./src/common/components/form/select/select.component.spec.tsx

```diff
import React from 'react';
+ import { Formik, Form } from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectComponent } from './select.component';
import { Lookup } from 'common/models';

+ const renderWithFormik = (component, initialValues) => ({
+   ...render(
+     <Formik initialValues={initialValues} onSubmit={console.log}>
+       {() => <Form>{component}</Form>}
+     </Formik>
+   ),
+ });
...

  it('should update selected item when it clicks on third item using Formik', () => {
    ...
    // Act
-   render(<SelectComponent {...props} />);
+   renderWithFormik(<SelectComponent {...props} />, { selectedItem: '1' });

+   const selectElement = screen.getByRole('button', { name: /Item 1/i });

+   expect(selectElement.textContent).toEqual('Item 1');

+   userEvent.click(selectElement);
+   const itemElementList = screen.getAllByRole('option');
+   userEvent.click(itemElementList[2]);

+   // Assert
+   expect(selectElement.textContent).toEqual('Item 3');
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
