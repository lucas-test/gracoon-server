import { Coord } from "gramoloss";
import { broadcastInRoom } from "../..";
import { handleBoardModification } from "../../handler";
import { HistBoard } from "../../hist_board";
import { Client } from "../../user";
import { BoardModification, SENSIBILITY, ServerBoard } from "../modification";

class UpdateElementData {
    index: number;
    kind: string;
    param: string;
    new_value: any;
    old_value: any;
        
    constructor(index: number, kind: string, param: string, new_value: any, old_value: any){
        this.index = index;
        this.kind = kind;
        this.param = param;
        this.new_value = new_value;
        this.old_value = old_value;
    }
}

export class UpdateElements implements BoardModification {
    agregId: string
    updates: Array<UpdateElementData>;
    
    constructor(agregId: string, index: number, kind: string, param: string, new_value: any, old_value: any){
        this.agregId = agregId;
        this.updates = new Array<UpdateElementData>();
        const data = new UpdateElementData(index, kind, param, new_value, old_value);
        this.updates.push(data);
    }

    try_implement(board: ServerBoard): Set<SENSIBILITY> | string{
        for ( const update of this.updates){
            if (update.kind == "TextZone" && board.text_zones.has(update.index)){
                const textZone = board.text_zones.get(update.index);
                if (textZone !== undefined){
                    if (update.param == "text"){
                        textZone.text = update.new_value;
                    } else if (update.param == "width"){
                        textZone.width = update.new_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            } else if (update.kind == "Vertex" && board.graph.vertices.has(update.index)){
                const vertex = board.graph.vertices.get(update.index);
                if (vertex !== undefined){
                    if (update.param == "color"){
                        vertex.data.color = update.new_value;
                    } else if (update.param == "weight"){
                        vertex.data.weight = update.new_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            }else if (update.kind == "Link" && board.graph.links.has(update.index)){
                const link = board.graph.links.get(update.index);
                if (link !== undefined){
                    if (update.param == "cp"){
                        link.data.cp = update.new_value;
                    } else if (update.param == "color"){
                        link.data.color = update.new_value;
                    } else if (update.param == "weight"){
                        link.data.weight = update.new_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            }else if (update.kind == "Stroke" && board.strokes.has(update.index)){
                const stroke = board.strokes.get(update.index);
                if (stroke !== undefined){
                    if (update.param == "color"){
                        stroke.color = update.new_value;
                    } else if (update.param == "width"){
                        stroke.width = update.new_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            }else if (update.kind == "Area" && board.areas.has(update.index)){
                const area = board.areas.get(update.index);
                if (area !== undefined){
                    if (update.param == "color"){
                        area.color = update.new_value;
                    } else if (update.param == "label"){
                        area.label = update.new_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            }else {
                return "Error: index not in text_zones";
            }
        }
        return new Set();
    }

    deimplement(board: ServerBoard): Set<SENSIBILITY>{
        for (const update of this.updates){
            if (update.kind == "TextZone" && board.text_zones.has(update.index)){
                const textZone = board.text_zones.get(update.index);
                if (textZone !== undefined){
                    if (update.param == "text"){
                        textZone.text = update.old_value;
                    } else if (update.param == "width"){
                        textZone.width = update.old_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            }else if (update.kind == "Vertex" && board.graph.vertices.has(update.index)){
                const vertex = board.graph.vertices.get(update.index);
                if (vertex !== undefined){
                    if (update.param == "color"){
                        vertex.data.color = update.old_value;
                    } else if (update.param == "weight"){
                        vertex.data.weight = update.old_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            }else if (update.kind == "Link" && board.graph.links.has(update.index)){
                const link = board.graph.links.get(update.index);
                if (link !== undefined){
                    if (update.param == "cp"){
                        link.data.cp = update.old_value;
                    } else if (update.param == "color"){
                        link.data.color = update.old_value;
                    } else if (update.param == "weight"){
                        link.data.weight = update.old_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }           
            }else if (update.kind == "Stroke" && board.strokes.has(update.index)){
                const stroke = board.strokes.get(update.index);
                if (stroke !== undefined){
                    if (update.param == "color"){
                        stroke.color = update.old_value;
                    } else if (update.param == "width"){
                        stroke.width = update.old_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            }else if (update.kind == "Area" && board.areas.has(update.index)){
                const area = board.areas.get(update.index);
                if (area !== undefined){
                    if (update.param == "color"){
                        area.color = update.old_value;
                    } else if (update.param == "label"){
                        area.label = update.old_value;
                    } else {
                        console.log(`parameter ${update.param} not implemented`)
                    }
                }
            }
            
        }
        return new Set();
    }

    agregate(index: number, kind: string, param: string, new_value: any, old_value: any){
        const newUpdate = new UpdateElementData(index, kind, param, new_value, old_value);
        for (const update of this.updates){
            if (update.index == newUpdate.index && update.kind == newUpdate.kind && update.param == newUpdate.param){
                update.new_value = newUpdate.new_value;
                return;
            }
        }
        this.updates.push(newUpdate);
    }

    static handle(board: HistBoard, agregId: string, kind: string, index: number, param: string, new_value: any) {
        console.log("Handle: update_element", agregId, kind, index, param, new_value);
        const old_value = board.get_value(kind, index, param);
        if (param == "cp") {
            if (new_value.hasOwnProperty('x') && new_value.hasOwnProperty('y')) {
                new_value = new Coord(new_value.x, new_value.y);
            } else {
                new_value = undefined;
            }
        }

        if (board.modifications_stack.length > 0){
            const lastModif = board.modifications_stack[board.modifications_stack.length-1];
            if (lastModif instanceof UpdateElements && lastModif.agregId == agregId){
                lastModif.agregate(index, kind, param, new_value, old_value);
                lastModif.try_implement(board);
                // console.log(board.modifications_stack);
                // console.log(board.modifications_stack.length)
                broadcastInRoom(board.roomId, "update_element", { index: index, kind: kind, param: param, value: new_value }, new Set());
                return;
            }
        }
        
        const modif = new UpdateElements(agregId, index, kind, param, new_value, old_value);
        handleBoardModification(board, modif);
        // console.log(board.modifications_stack);
    }

    firstEmitImplementation(board: HistBoard): void{
    }

    emitImplementation(board: HistBoard): void{
        for( const update of this.updates){
            broadcastInRoom(board.roomId, "update_element", { index: update.index, kind: update.kind, param: update.param, value: update.new_value }, new Set());
        }
    }

    emitDeimplementation(board: HistBoard): void{
        for( const update of this.updates){
            broadcastInRoom(board.roomId, "update_element", { index: update.index, kind: update.kind, param: update.param, value: update.old_value }, new Set());
        }
    }


    static addEvent(client: Client){
        client.socket.on("update_element", (agregId: string, kind: string, index: number, param: string, newValue: any) => UpdateElements.handle(client.board, agregId, kind, index, param, newValue));
    }

}