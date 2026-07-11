import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { JSX } from 'preact';

interface JamCountdownProps {
    targetDate: string;
    label?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calcTimeLeft(target: string): TimeLeft {
    const diff = Math.max(0, new Date(target).getTime() - Date.now());
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
    };
}

const JamCountdown = ({ targetDate, label = 'restantes' }: JamCountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));

    useEffect(() => {
        const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    const units = [
        { value: timeLeft.days, label: 'días' },
        { value: timeLeft.hours, label: 'horas' },
        { value: timeLeft.minutes, label: 'min' },
        { value: timeLeft.seconds, label: 'seg' },
    ];

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                {units.map(({ value, label: unitLabel }, i) => (
                    <div key={unitLabel} className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                            <span
                                className="countdown font-mono text-4xl sm:text-5xl font-black text-white"
                                style={{ '--value': value } as JSX.CSSProperties}
                                aria-label={`${value} ${unitLabel}`}
                            >
                                <span style={{ '--value': value } as JSX.CSSProperties} />
                            </span>
                            <span className="text-[10px] text-base-content/50 uppercase tracking-widest mt-1">
                                {unitLabel}
                            </span>
                        </div>
                        {i < units.length - 1 && (
                            <span className="text-3xl font-black text-base-content/30 mb-4">:</span>
                        )}
                    </div>
                ))}
            </div>
            {label && (
                <span className="text-xs text-base-content/40 uppercase tracking-widest">{label}</span>
            )}
        </div>
    );
};

export default JamCountdown;
