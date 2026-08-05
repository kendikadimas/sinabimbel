export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'mt-2 text-sm font-medium text-rose-600 ' + className}
        >
            {message}
        </p>
    ) : null;
}
