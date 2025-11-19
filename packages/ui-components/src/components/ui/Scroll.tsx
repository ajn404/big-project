import React from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

interface ScrollComponentProps {
    children?: React.ReactNode
    // Add other props here
}

function ScrollComponent({ children, ...props }: ScrollComponentProps) {
    return (
        <div className="p-4 border rounded">
      // Component content
            {children}
        </div>
    )
}

// Auto-register the component
const RegisteredScrollComponent = createAutoRegisterComponent({
    id: 'scroll-component',
    name: 'ScrollComponent',
    description: 'Component description',
    category: CATEGORIES.UI,
    template: `:::react{component="ScrollComponent"}Content here:::`,
    tags: ['ui', 'component'],
    version: '1.0.0',
})(ScrollComponent)

export { RegisteredScrollComponent as ScrollComponent }