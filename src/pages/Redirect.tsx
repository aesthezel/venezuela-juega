import { useEffect } from 'preact/hooks';
import { RoutableProps, route } from 'preact-router';

const Redirect = ({ to }: { to: string } & RoutableProps) => {
    useEffect(() => {
        route(to, true);
    }, [to]);
    return null;
};

export default Redirect;
