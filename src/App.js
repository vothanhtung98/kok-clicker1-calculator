import './App.css';
import { useState } from 'react';
import Script from './script/script'

function App() {
  const [strategyForm, setStrategyForm] = useState({
    xp: '',
    intimacy: '',
    aphros: '',
    d: '',
    h: '',
    m: ''
  })

  const { xp, intimacy, aphros, d, h, m } = strategyForm

  const [strategy, setStrategy] = useState({})

  const { bestPurchaseStrat, originalStrategy, strategyAfterPurchase, freeTime } = strategy

  const onStrategyFormChange = event => {
    setStrategyForm({
      ...strategyForm,
      [event.target.name]: event.target.value
    })
  }

  const makeStrategy = e => {
    e.preventDefault()
    setStrategy(Script.completedStrat(parseInt(xp), parseInt(intimacy), parseInt(aphros), parseInt(d), parseInt(h), parseInt(m)))
  }

  const makeTextFrom = bestPurchaseStrat ? strategyAfterPurchase : originalStrategy

  return (
    <div className="App">
      <div className='dark-overlay'>
        <div className='calculator-container'>
          <h3>King Of Kinks Clicker 1 Strategy Calculator</h3>
          <h5>Time Left</h5>
          <div className='input-container'>
            <div className='input-item'>
              <span> Day(s): </span>
              <input
                type='text'
                placeholder='Day (0-13)'
                name='d'
                required
                value={d}
                onChange={onStrategyFormChange}
              />
            </div>

            <div className='input-item'>
              <span> Hour(s): </span>
              <input
                type='text'
                placeholder='Hour (0-24)'
                name='h'
                required
                value={h}
                onChange={onStrategyFormChange}
              />
            </div>

            <div className='input-item'>
              <span> Min(s): </span>
              <input
                type='text'
                placeholder='Minute (0-60)'
                name='m'
                required
                value={m}
                onChange={onStrategyFormChange}
              />
            </div>
          </div>

          <h5>Your Current Progress</h5>
          <div className='input-container'>
            <div className='input-item'>
              <span> XP: </span>
              <input
                type='text'
                placeholder='XP (0-814000)'
                name='xp'
                required
                value={xp}
                onChange={onStrategyFormChange}
              />
            </div>

            <div className='input-item'>
              <span> Intimacy: </span>
              <input
                type='text'
                placeholder='Intimacy (1-5)'
                name='intimacy'
                required
                value={intimacy}
                onChange={onStrategyFormChange}
              />
            </div>

            <div className='input-item'>
              <span> Aphrosidiacs: </span>
              <input
                type='text'
                placeholder='Aprhos (0-5800)'
                name='aphros'
                required
                value={aphros}
                onChange={onStrategyFormChange}
              />
            </div>
          </div>

          <div>
            <button onClick={makeStrategy}>Find Strategy</button>
          </div>
        </div>

        {makeTextFrom &&
          <div>
            {bestPurchaseStrat &&
              <>
                {bestPurchaseStrat.aphrosPurchaseTimes !== 0 &&
                  <p>Step 0: Buy {bestPurchaseStrat.aphrosPurchaseTimes * 200} Aphrosidiacs.</p>
                }
                {makeTextFrom.map((intimacyLvl, index) => {
                  return <p key={index}>Step {index + 1}: Stop using stamina after {Script.changeTimeFormatFromMinute(intimacyLvl.timeToStop)}, save stamina for {Script.changeTimeFormatFromMinute(intimacyLvl.timeSave)} then upgrade to Intimacy lvl {intimacyLvl.upgradeToIntimacyLvl} and use all stamina.</p>
                })}
                {bestPurchaseStrat.staminaPurchaeTimes &&
                  <p>Step {makeTextFrom.length + 1}: Buy Stamina {bestPurchaseStrat.staminaPurchaeTimes} times.</p>
                }
                <p>You have {Script.changeTimeFormatFromMinute(bestPurchaseStrat.freeTime)} of leeway. Total gems required: {bestPurchaseStrat.totalCost}.</p>
              </>
            }
            {!bestPurchaseStrat &&
              <>
                {makeTextFrom.map((intimacyLvl, index) => {
                  return <p key={index}>Step {index + 1}: Stop using stamina after {Script.changeTimeFormatFromMinute(intimacyLvl.timeToStop)}, save stamina for {Script.changeTimeFormatFromMinute(intimacyLvl.timeSave)} then upgrade to Intimacy lvl {intimacyLvl.upgradeToIntimacyLvl} and use all stamina.</p>
                })}
                <p>You have {Script.changeTimeFormatFromMinute(freeTime)} of leeway. Total gems required: 0. </p>
              </>
            }
          </div>
        }
      </div>
    </div>
  );
}

export default App;
