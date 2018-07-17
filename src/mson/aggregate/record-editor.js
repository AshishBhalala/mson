export default {
  name: 'RecordEditor',
  component: 'Form',
  schema: {
    component: 'Form',
    fields: [
      {
        name: 'baseForm',
        component: 'Field',
        required: true
      },
      {
        name: 'label',
        component: 'TextField',
        required: true
      },
      {
        name: 'storeName',
        component: 'TextField'
      },
      {
        name: 'storeWhere',
        component: 'WhereField'
      },
      {
        name: 'preview',
        component: 'BooleanField'
      },
      {
        name: 'hideCancel',
        component: 'BooleanField'
      }
    ]
  },
  form: {
    component: '{{baseForm}}',
    fields: [
      {
        component: 'ButtonField',
        name: 'edit',
        label: 'Edit',
        icon: 'ModeEdit',
        hidden: true
      },
      {
        component: 'ButtonField',
        storeName: 'submit',
        name: 'save',
        label: 'Save',
        icon: 'Save'
      },
      {
        component: 'ButtonField',
        name: 'cancel',
        label: 'Cancel',
        icon: 'Cancel',
        hidden: true
      }
    ]
  },
  listeners: [
    {
      event: 'load',
      actions: [
        {
          component: 'Set',
          name: 'isLoading',
          value: true
        },
        {
          component: 'Action',
          if: {
            storeWhere: {
              $ne: null
            }
          },
          actions: [
            {
              component: 'GetRecord',
              storeName: '{{storeName}}',
              where: '{{storeWhere}}'
            },
            {
              component: 'Set',
              name: 'value',
              value: '{{arguments.fieldValues}}'
            },
            {
              component: 'Set',
              name: 'userId',
              value: '{{arguments.userId}}'
            },
            {
              component: 'Set',
              name: 'fields.id.value',
              value: '{{arguments.id}}'
            }
          ]
        },
        {
          component: 'Set',
          name: 'pristine',
          value: true
        },
        {
          if: {
            preview: {
              $ne: false
            }
          },
          component: 'Emit',
          event: 'read'
        },
        {
          if: {
            preview: false
          },
          component: 'Emit',
          event: 'edit'
        },
        {
          component: 'Set',
          name: 'isLoading',
          value: false
        }
      ]
    },
    {
      event: 'read',
      actions: [
        {
          component: 'Set',
          name: 'mode',
          value: 'read'
        },
        {
          component: 'Set',
          name: 'editable',
          value: false
        },
        {
          component: 'Set',
          name: 'fields.save.hidden',
          value: true
        },
        {
          component: 'Set',
          name: 'fields.edit.hidden',
          value: false
        },
        {
          component: 'Set',
          name: 'fields.cancel.hidden',
          value: true
        },
        {
          component: 'Emit',
          event: 'didRead'
        }
      ]
    },
    {
      event: 'edit',
      actions: [
        {
          component: 'Set',
          name: 'mode',
          value: 'update'
        },
        {
          component: 'Set',
          name: 'editable',
          value: true
        },
        {
          component: 'Set',
          name: 'fields.save.hidden',
          value: false
        },
        {
          component: 'Set',
          name: 'fields.save.disabled',
          value: true
        },
        {
          component: 'Set',
          name: 'fields.edit.hidden',
          value: true
        },
        {
          if: {
            hideCancel: {
              $ne: true
            }
          },
          component: 'Set',
          name: 'fields.cancel.hidden',
          value: false
        },
        {
          component: 'Emit',
          event: 'didEdit'
        }
      ]
    },
    {
      event: 'canSubmit',
      actions: [
        {
          component: 'Set',
          name: 'fields.save.disabled',
          value: false
        },
        {
          component: 'Emit',
          event: 'didCanSubmit'
        }
      ]
    },
    {
      event: 'cannotSubmit',
      actions: [
        {
          component: 'Set',
          name: 'fields.save.disabled',
          value: true
        },
        {
          component: 'Emit',
          event: 'didCannotSubmit'
        }
      ]
    },
    {
      event: 'save',
      actions: [
        {
          component: 'UpsertRecord',
          storeName: '{{storeName}}'
        },
        {
          '//': 'Needed or else will be prompted to discard changes',
          component: 'Set',
          name: 'pristine',
          value: true
        },
        {
          component: 'Snackbar',
          message: '{{label}} saved'
        },
        {
          '//':
            'Needed to restore read data as may be different and update access',
          if: {
            preview: {
              $ne: false
            }
          },
          component: 'Emit',
          event: 'load'
        },
        {
          component: 'Emit',
          event: 'didSave'
        }
      ]
    },
    {
      event: 'cancel',
      actions: [
        {
          component: 'Emit',
          event: 'load'
        },
        {
          component: 'Emit',
          event: 'didCancel'
        }
      ]
    }
  ]
};
