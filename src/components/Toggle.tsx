
interface ToggleProps {
    id?: string;
    value: boolean;
    setValue(value: boolean): void;
}

export const CheckToggle = ({ id, value, setValue }: ToggleProps) => (
    <input
        id={id}
        type="checkbox"
        className="checkbox"
        checked={value}
        onChange={e => setValue(e.target.checked)}
    />
)
