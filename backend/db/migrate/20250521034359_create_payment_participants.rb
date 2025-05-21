class CreatePaymentParticipants < ActiveRecord::Migration[8.0]
  def change
    create_table :payment_participants do |t|
      t.references :payment, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: { to_table: :users }
      t.integer :share_amount
      t.integer :share_rate
      t.integer :paid_amount

      t.timestamps
    end
  end
end
