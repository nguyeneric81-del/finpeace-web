import os
import argparse
from datetime import date
from supabase import create_client
from dotenv import load_dotenv

# Load env
env_path = '/Users/tuananhnguyen/workspace-gravity/finpeace-web/.env.local'
load_dotenv(env_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError('Supabase env missing')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_review(review_id: str, decision: str):
    """Update review status and propagate to trading_plan if approved.
    decision: 'approve' or 'reject'
    """
    # Update review status
    new_status = 'approved' if decision == 'approve' else 'rejected'
    res = supabase.table('trading_plan_daily_reviews')\
        .update({'status': new_status})\
        .eq('id', review_id)\
        .execute()
    if res.error:
        print(f"Error updating review: {res.error}")
        return
    print(f"Review {review_id} set to {new_status}")

    if new_status == 'approved':
        # Fetch the review to get plan_id and suggested_action
        review = supabase.table('trading_plan_daily_reviews')\
            .select('plan_id, suggested_action')\
            .eq('id', review_id)\
            .single()\
            .execute()
        if review.error:
            print(f"Error fetching review: {review.error}")
            return
        data = review.data
        plan_id = data['plan_id']
        action = data['suggested_action']
        # Map action to plan status updates (simplified)
        # Example: if action is TRIGGER_BUY -> set trading_plans.status = 'ready_to_buy'
        #           if action is STOP_LOSS -> set status = 'stoploss_triggered'
        #           if action is TAKE_PROFIT -> set status = 'takeprofit_triggered'
        #           else keep unchanged
        status_map = {
            'TRIGGER_BUY': 'ready_to_buy',
            'STOP_LOSS': 'stoploss_triggered',
            'TAKE_PROFIT': 'takeprofit_triggered',
            'CANCEL': 'cancelled',
            'HOLD': None,
        }
        new_plan_status = status_map.get(action)
        if new_plan_status:
            upd = supabase.table('trading_plans')\
                .update({'status': new_plan_status})\
                .eq('id', plan_id)\
                .execute()
            if upd.error:
                print(f"Error updating trading plan: {upd.error}")
            else:
                print(f"Trading plan {plan_id} status updated to {new_plan_status}")
        else:
            print('No status change required for HOLD action.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Approve or reject a pending EOD review')
    parser.add_argument('review_id', help='UUID of the review record')
    parser.add_argument('decision', choices=['approve', 'reject'], help='Decision to apply')
    args = parser.parse_args()
    update_review(args.review_id, args.decision)
