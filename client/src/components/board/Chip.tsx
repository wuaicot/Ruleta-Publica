import { useCallback, useContext, useLayoutEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { gameStore, GameContext } from "../../store/gameStore";
import "./Chips.css";

interface ChipProps {
    id: string;
    alt: string;
    url: string;
    style?: {
        top: number | string;
        left: number | string;
    };
}

interface DropResultType {
    name: string;
    location: { x: number; y: number };
}

let dropResult: DropResultType | null;

function chipIsPlacedOnBoard(style: ChipProps["style"]): boolean {
    if (!style) return false;
    return typeof style.top === "number" && typeof style.left === "number";
}

export const Chip = (props: ChipProps) => {
    const { setChipsTaken, setBoardItemOccupied, setBetLocation, setAllBets } =
        useContext(GameContext);
    const { url, alt, id, style } = props;
    const placedOnBoard = chipIsPlacedOnBoard(style);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "chips",
        item: { id: id },
        end: (item, monitor) => {
            dropResult = monitor.getDropResult();
            if (dropResult) {
                setChipsTaken(+item.id);
                setBoardItemOccupied(dropResult.name);
                setBetLocation(dropResult.location);
                setAllBets(gameStore.newBet);
            }
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const chipRef = useRef<HTMLImageElement | null>(null);
    const bindChipRef = useCallback(
        (node: HTMLImageElement | null) => {
            chipRef.current = node;
            drag(node);
        },
        [drag],
    );

    useLayoutEffect(() => {
        const el = chipRef.current;
        if (!el) return;
        if (placedOnBoard && style) {
            el.style.setProperty("--chip-top", `${style.top}px`);
            el.style.setProperty("--chip-left", `${style.left}px`);
        } else {
            el.style.removeProperty("--chip-top");
            el.style.removeProperty("--chip-left");
        }
    }, [placedOnBoard, style]);

    const chipClass = [
        "board-chip",
        placedOnBoard ? "board-chip--placed" : "",
        isDragging ? "board-chip--dragging" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <img
            ref={bindChipRef}
            src={url}
            alt={alt}
            id={id}
            className={chipClass}
        />
    );
};
