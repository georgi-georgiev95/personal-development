import * as React from 'react'
import { Modal, Button } from 'ui-kit'

export const Default = () => (
  <Modal open onOpenChange={() => {}} label="Example modal">
    <Modal.Header>
      <h2 style={{ margin: 0 }}>Example modal</h2>
    </Modal.Header>
    <Modal.Content>
      <p style={{ margin: 0 }}>
        This is a generic reusable modal. Compose it with Header, Content, and
        Footer.
      </p>
    </Modal.Content>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => {}}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => {}}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
)

export const WithoutCloseButton = () => (
  <Modal
    open
    onOpenChange={() => {}}
    label="No close button"
    showCloseButton={false}
  >
    <Modal.Header>
      <h2 style={{ margin: 0 }}>No close button</h2>
    </Modal.Header>
    <Modal.Content>
      <p style={{ margin: 0 }}>This modal has the header close button hidden.</p>
    </Modal.Content>
    <Modal.Footer>
      <Button variant="primary" onClick={() => {}}>
        Got it
      </Button>
    </Modal.Footer>
  </Modal>
)
