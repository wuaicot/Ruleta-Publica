import { observer } from "mobx-react";
import { chipsColors } from "../../utils/utils";
import { Chip } from "./Chip";
import "./Chips.css";

export const Chips = observer(() => {
    return (
        <div className="chip-container">
            {chipsColors.map((chips) => (
                <Chip
                    id={chips.id}
                    alt={chips.alt}
                    url={chips.url}
                    key={Math.random()}
                />
            ))}
        </div>
    );
});
