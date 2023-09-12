import { Coord } from "gramoloss";
import { emit_graph_to_room } from ".";
import { HistBoard } from "./hist_board";
import { SubdivideLinkModification } from "./modifications/implementations/subdivide_link";


export function handleSubdivideLink(board: HistBoard, roomId: string, linkIndex: number, pos: Coord, callback: (response: number) => void) {
    console.log("Receive Request: subdivide_link");

    const link = board.graph.links.get(linkIndex);
    
    if (link !== undefined) {
        const modif = SubdivideLinkModification.fromGraph(board, linkIndex, pos);
        if (typeof modif == "undefined"){
            console.log(`Error: cannot create Subdivide Link`);
            return;
        }
        const r = board.try_push_new_modification(modif);
        if (typeof r === "string") {
            console.log(r);
        } else {
            callback(modif.newVertex.index);
            emit_graph_to_room(board, roomId, r);
        }
    }
}