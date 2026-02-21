export interface Doc {
  id: string;
  title: string;
  render: () => string;
  afterRender?: () => void;
}
