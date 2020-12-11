import React from "react"
import './App.css';

/************************************************ 
Note: 
Intentionally used class based components instead of Hooks as PRoblem statement mentioned object-oriented programming. 
Otherwise, Hooks are cleaner to implement and make code readability better. 
*************************************************/

class App extends React.Component {
    
    // State defined as : price to display price, data[] contains API data and references[] contains React refs to each scrollable currency
    constructor(){
        super();
        this.state={
            price:"Price",
            data:[],
            references:[],
        }
        this.selectRef = React.createRef();
        //this.registerObserver = this.registerObserver.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }
    
    
    // Fetching from API Happens in ComponentDidMount 
    componentDidMount(){
        
       console.log(this.selectRef); fetch("https://api.coindesk.com/v1/bpi/currentprice.json").then(response=> response.json() ).then((data)=> this.setState({data:["", ...Object.values(data.bpi), ""]}, 
       () => {
           const refs = []
           this.state.data.forEach((entry,index)=> refs.push(React.createRef()));
           this.setState({references: refs});
       }
       )).catch((err)=>{alert("Couldn't fetch data")});
    }
    
    // Alternately intersection observer can be used - example code commented below
    /*
    registerObserver(ref){
        console.log(ref);
        const observer = new IntersectionObserver((entries, observer) =>{
            entries.forEach(entry=>{
                if(!entry.isIntersecting){
                    return;
                }
                console.log(entry)
                
            })
        })
        observer.observe(ref);
        
    }
    */
    
    
    // My own implementation to simulate behavior similar to Intersection Observer for scroll event
    handleScroll(){
        const top = this.selectRef.current.getBoundingClientRect().top;
        const bottom = this.selectRef.current.getBoundingClientRect().bottom;
        
        this.state.references.map((refs,index)=>{
            if(refs.current.getBoundingClientRect().top < bottom && refs.current.getBoundingClientRect().top > top){
                this.setState({price:this.state.data[index].rate})
                refs.current.className="currency black"
                console.log(refs.current.textContent);
            } else {
                refs.current.className="currency grey";
            }
        })
    }

    render(){
        return (
        <div className="app-container">
            <section className="top-section">
                <img className="logo" src="./media/logo.jpg" alt="Bitcoin Price App"></img>
                <span>{this.state.price}</span>
            </section>
            <section className="bottom-section" onScroll={this.handleScroll}>
                {this.state.data.map((currency, index)=>{
                    return <div key={index} ref={this.state.references[index]} className="currency">{currency.code}</div>
                })}
            </section>
            <div ref={this.selectRef} className="selected-currency"></div>
        </div>
    );
        
        
    }
}

export default App;
