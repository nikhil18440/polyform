import { validateSchema } from "../app/validator.js"

export const schema = {
    type:"Form",
    props:{
        class: "name",
    },
    children: [
        {
            type: "TextField",
            props:{
                label: "Name",
                name: "userName"
            }
        },
        {
            type: "Button",
            props:{
                label: "Submit",
                action: "submitForm"
            }
        }
    ]
}

validateSchema(schema)