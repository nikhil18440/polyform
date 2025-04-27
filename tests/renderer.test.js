import { renderReact } from "../renderer";

describe('React Renderer', () => {
  it('should render a simple form schema', () => {
    const schema = {
      type: "Form",
      props: { title: "Signup" },
      children: [
        { type: "TextField", props: { label: "Email" }, children: [] },
        { type: "Button", props: { text: "Submit" }, children: [] }
      ],
    };

    const result = renderReact(schema);
    console.log(result);

    expect(result).toContain('<Form title="Signup">');
    expect(result).toContain('<TextField label="Email" />');
    expect(result).toContain('<Button text="Submit" />');
    expect(result).toContain('</Form>');
  });
});
