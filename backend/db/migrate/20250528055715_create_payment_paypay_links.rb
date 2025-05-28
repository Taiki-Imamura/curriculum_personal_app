class CreatePaymentPaypayLinks < ActiveRecord::Migration[8.0]
  def change
    create_table :payment_paypay_links do |t|
      t.references :payment, null: false, foreign_key: true
      t.string :paypay_url
      t.boolean :display_on_list

      t.timestamps
    end
  end
end
