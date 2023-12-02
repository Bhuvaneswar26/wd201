const todo_list = require("../todo");

const {all,add,markAsComplete} = todo_list();

describe("Todo list Test Suite",()=>{
    beforeAll(() => {
        add(
            {
                titile:"Test todo",
                completed:false,
                dueDate: new Date().toISOString().slice(0,10)
            }
        );
        }
    )
    test("Should add new todo",()=>{
        let len =  all.length;
        add(
            {
                titile:"Test todo",
                completed:false,
                dueDate: new Date().toISOString().slice(0,10)
            }
        );
        expect(all.length).toBe(len+1);
    });

    test(" Should mark a todo as complete",()=>{
        expect(all[0].completed).toBe(false);
        markAsComplete(0);
        expect(all[0].completed).toBe(true);

    })
})